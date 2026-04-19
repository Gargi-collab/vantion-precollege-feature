from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from typing import Any


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "signalsms.db"


def init_db() -> None:
    """Create SQLite tables used by the local demo."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    with sqlite3.connect(DB_PATH) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender_number TEXT NOT NULL,
                message_text TEXT NOT NULL,
                spam_type TEXT NOT NULL,
                risk_level TEXT NOT NULL,
                reasoning TEXT NOT NULL,
                action TEXT NOT NULL DEFAULT 'report',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS message_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender_number TEXT NOT NULL,
                message_text TEXT NOT NULL,
                label TEXT NOT NULL,
                confidence REAL NOT NULL,
                risk_level TEXT NOT NULL,
                spam_type TEXT NOT NULL,
                report_count INTEGER NOT NULL,
                frequently_reported INTEGER NOT NULL,
                link_safety TEXT,
                recommended_action TEXT NOT NULL,
                signals_json TEXT NOT NULL,
                reasoning TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )


def _connect() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def normalize_sender(sender_number: str | None) -> str:
    if not sender_number:
        return "unknown"

    raw = sender_number.strip()
    digits = "".join(character for character in raw if character.isdigit())
    if not digits:
        return raw.lower() or "unknown"

    if raw.startswith("+"):
        return f"+{digits}"
    return digits


def get_sender_report_stats(sender_number: str | None) -> dict[str, Any]:
    normalized_sender = normalize_sender(sender_number)
    with _connect() as connection:
        row = connection.execute(
            """
            SELECT COUNT(*) AS report_count
            FROM reports
            WHERE sender_number = ?
            """,
            (normalized_sender,),
        ).fetchone()

    report_count = int(row["report_count"]) if row else 0
    return {
        "sender_number": normalized_sender,
        "report_count": report_count,
        "frequently_reported": report_count >= 3,
    }


def save_report(
    *,
    sender_number: str | None,
    message_text: str,
    spam_type: str,
    risk_level: str,
    reasoning: str,
    action: str,
) -> dict[str, Any]:
    normalized_sender = normalize_sender(sender_number)
    with _connect() as connection:
        connection.execute(
            """
            INSERT INTO reports (sender_number, message_text, spam_type, risk_level, reasoning, action)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (normalized_sender, message_text, spam_type, risk_level, reasoning, action),
        )
        connection.commit()

    return get_sender_report_stats(normalized_sender)


def save_history(*, sender_number: str | None, message_text: str, result: dict[str, Any]) -> None:
    normalized_sender = normalize_sender(sender_number)
    with _connect() as connection:
        connection.execute(
            """
            INSERT INTO message_history (
                sender_number,
                message_text,
                label,
                confidence,
                risk_level,
                spam_type,
                report_count,
                frequently_reported,
                link_safety,
                recommended_action,
                signals_json,
                reasoning
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                normalized_sender,
                message_text,
                result["label"],
                result["confidence"],
                result["risk_level"],
                result["spam_type"],
                result["report_count"],
                int(result["frequently_reported"]),
                result["link_safety"],
                result["recommended_action"],
                json.dumps(result["signals"]),
                result["reasoning"],
            ),
        )
        connection.commit()


def get_history(limit: int = 25) -> list[dict[str, Any]]:
    with _connect() as connection:
        rows = connection.execute(
            """
            SELECT *
            FROM message_history
            ORDER BY id DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()

    history: list[dict[str, Any]] = []
    for row in rows:
        history.append(
            {
                "id": row["id"],
                "sender_number": row["sender_number"],
                "message_text": row["message_text"],
                "label": row["label"],
                "confidence": row["confidence"],
                "risk_level": row["risk_level"],
                "spam_type": row["spam_type"],
                "report_count": row["report_count"],
                "frequently_reported": bool(row["frequently_reported"]),
                "link_safety": row["link_safety"],
                "recommended_action": row["recommended_action"],
                "signals": json.loads(row["signals_json"]),
                "reasoning": row["reasoning"],
                "created_at": row["created_at"],
            }
        )
    return history


def get_history_summary() -> dict[str, Any]:
    with _connect() as connection:
        total_row = connection.execute(
            """
            SELECT COUNT(*) AS total_messages,
                   SUM(CASE WHEN label = 'spam' THEN 1 ELSE 0 END) AS spam_messages
            FROM message_history
            """
        ).fetchone()
        common_row = connection.execute(
            """
            SELECT spam_type, COUNT(*) AS total
            FROM message_history
            WHERE label = 'spam'
            GROUP BY spam_type
            ORDER BY total DESC, spam_type ASC
            LIMIT 1
            """
        ).fetchone()

    total_messages = int(total_row["total_messages"] or 0) if total_row else 0
    spam_messages = int(total_row["spam_messages"] or 0) if total_row else 0
    spam_percentage = round((spam_messages / total_messages) * 100, 1) if total_messages else 0.0

    return {
        "total_messages_analyzed": total_messages,
        "spam_percentage": spam_percentage,
        "most_common_spam_type": common_row["spam_type"] if common_row else "unknown",
    }
