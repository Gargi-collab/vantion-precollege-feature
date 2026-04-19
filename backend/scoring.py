from __future__ import annotations

from typing import Literal

from features import FeatureSet


def heuristic_signal_score(features: FeatureSet, report_count: int, frequently_reported: bool) -> float:
    """Score hand-crafted suspicious signals for a fast local demo."""
    score = 0.06
    score += min(len(features.lottery_keywords) * 0.09, 0.24)
    score += min(len(features.phishing_keywords) * 0.11, 0.28)
    score += min(len(features.financial_keywords) * 0.09, 0.18)
    score += min(len(features.marketing_keywords) * 0.07, 0.18)
    score += min(len(features.urgency_keywords) * 0.06, 0.12)
    score += 0.08 if features.urls else 0.0
    score += 0.16 if features.shortened_links else 0.0
    score += min(len(features.suspicious_link_patterns) * 0.08, 0.18)
    score += 0.06 if features.phone_numbers else 0.0
    score += 0.05 if features.currency_symbols else 0.0
    score += 0.09 if features.excessive_uppercase else 0.0
    score += 0.05 if features.repeated_punctuation else 0.0
    score += min(report_count * 0.03, 0.18)
    score += 0.1 if frequently_reported else 0.0
    score -= min(len(features.ham_keywords) * 0.07, 0.18)
    return min(max(score, 0.01), 0.99)


def combine_confidence(model_confidence: float, heuristic_score: float) -> float:
    combined = (model_confidence * 0.58) + (heuristic_score * 0.42)
    return min(max(combined, 0.01), 0.99)


def get_risk_level(confidence: float) -> Literal["low", "medium", "high"]:
    if confidence < 0.4:
        return "low"
    if confidence <= 0.75:
        return "medium"
    return "high"


def classify_spam_type(features: FeatureSet, label: str) -> str:
    if label != "spam":
        return "unknown"
    if features.phishing_keywords and features.urls:
        return "phishing"
    if features.lottery_keywords:
        return "lottery"
    if features.financial_keywords or features.currency_symbols:
        return "financial"
    if features.marketing_keywords:
        return "marketing"
    return "scam"


def get_link_safety(features: FeatureSet) -> str | None:
    if not features.urls:
        return None
    if features.shortened_links or features.suspicious_link_patterns:
        return "suspicious"
    return "safe"


def summarize_signals(features: FeatureSet, report_count: int, frequently_reported: bool) -> list[str]:
    signals: list[str] = []

    for keyword in features.lottery_keywords[:2]:
        signals.append(f"keyword: {keyword}")
    for keyword in features.phishing_keywords[:2]:
        signals.append(f"phishing-term: {keyword}")
    for keyword in features.financial_keywords[:2]:
        signals.append(f"financial-term: {keyword}")
    for keyword in features.marketing_keywords[:2]:
        signals.append(f"marketing-term: {keyword}")

    if features.urls:
        signals.append("contains link")
    if features.shortened_links:
        signals.append("shortened link")
    if features.phone_numbers:
        signals.append("contains phone number")
    if features.currency_symbols:
        signals.append("currency symbol")
    if features.excessive_uppercase:
        signals.append("uppercase emphasis")
    if features.repeated_punctuation:
        signals.append("repeated punctuation")
    if frequently_reported:
        signals.append("sender frequently reported")
    elif report_count > 0:
        signals.append(f"sender reported {report_count} time(s)")

    if not signals and features.ham_keywords:
        signals.append("conversational language")
    if not signals:
        signals.append("low-risk neutral phrasing")

    return signals[:8]


def build_reasoning(
    *,
    label: str,
    spam_type: str,
    features: FeatureSet,
    report_count: int,
    frequently_reported: bool,
    link_safety: str | None,
) -> str:
    if label == "ham":
        return "The message looks conversational and does not show strong scam indicators."

    reasons: list[str] = []
    if spam_type != "unknown":
        reasons.append(f"{spam_type}-style language")
    if features.urls:
        reasons.append("a link")
    if link_safety == "suspicious":
        reasons.append("a suspicious URL pattern")
    if features.currency_symbols or features.financial_keywords:
        reasons.append("money-related bait")
    if features.excessive_uppercase or features.repeated_punctuation:
        reasons.append("high-pressure formatting")
    if frequently_reported:
        reasons.append("a sender with repeated community reports")
    elif report_count > 0:
        reasons.append(f"{report_count} prior sender report(s)")

    if not reasons:
        reasons.append("multiple scam-adjacent signals")

    return "Contains " + ", ".join(reasons) + "."


def get_recommended_action(risk_level: str, frequently_reported: bool) -> Literal["block", "ignore", "review"]:
    if risk_level == "high" or frequently_reported:
        return "block"
    if risk_level == "medium":
        return "review"
    return "ignore"
