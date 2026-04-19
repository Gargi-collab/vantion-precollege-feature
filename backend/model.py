from __future__ import annotations

from typing import Any

from features import FeatureSet, extract_features
from scoring import (
    build_reasoning,
    classify_spam_type,
    combine_confidence,
    get_link_safety,
    get_recommended_action,
    get_risk_level,
    heuristic_signal_score,
    summarize_signals,
)


def estimate_model_confidence(features: FeatureSet) -> float:
    """
    Lightweight pseudo-model score.
    This keeps the demo fast while still separating "model" logic from heuristics.
    """
    confidence = 0.14
    confidence += min(len(features.lottery_keywords) * 0.11, 0.24)
    confidence += min(len(features.phishing_keywords) * 0.12, 0.26)
    confidence += min(len(features.financial_keywords) * 0.1, 0.18)
    confidence += min(len(features.marketing_keywords) * 0.08, 0.18)
    confidence += min(len(features.urgency_keywords) * 0.05, 0.12)
    confidence += 0.08 if features.urls else 0.0
    confidence += 0.12 if features.shortened_links else 0.0
    confidence += 0.05 if features.phone_numbers else 0.0
    confidence += 0.05 if features.currency_symbols else 0.0
    confidence += 0.07 if features.excessive_uppercase else 0.0
    confidence += 0.04 if features.repeated_punctuation else 0.0
    confidence -= min(len(features.ham_keywords) * 0.1, 0.22)
    return min(max(confidence, 0.01), 0.99)


def analyze_message(
    *,
    text: str,
    report_count: int,
    frequently_reported: bool,
) -> dict[str, Any]:
    features = extract_features(text)
    model_confidence = estimate_model_confidence(features)
    heuristic_score = heuristic_signal_score(features, report_count, frequently_reported)
    confidence = combine_confidence(model_confidence, heuristic_score)
    label = "spam" if confidence >= 0.5 else "ham"
    risk_level = get_risk_level(confidence)
    spam_type = classify_spam_type(features, label)
    link_safety = get_link_safety(features)
    signals = summarize_signals(features, report_count, frequently_reported)
    reasoning = build_reasoning(
        label=label,
        spam_type=spam_type,
        features=features,
        report_count=report_count,
        frequently_reported=frequently_reported,
        link_safety=link_safety,
    )
    recommended_action = get_recommended_action(risk_level, frequently_reported)

    return {
        "label": label,
        "confidence": round(confidence, 3),
        "risk_level": risk_level,
        "spam_type": spam_type,
        "signals": signals,
        "reasoning": reasoning,
        "report_count": report_count,
        "frequently_reported": frequently_reported,
        "recommended_action": recommended_action,
        "link_safety": link_safety,
    }
