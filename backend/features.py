from __future__ import annotations

import re
from dataclasses import dataclass


URL_REGEX = re.compile(r"(https?://[^\s]+|www\.[^\s]+)", re.IGNORECASE)
PHONE_REGEX = re.compile(r"(?:\+?\d[\d\s().-]{7,}\d)")
CURRENCY_REGEX = re.compile(r"[$£€₹]")
REPEATED_PUNCTUATION_REGEX = re.compile(r"([!?])\1{1,}")
UPPERCASE_WORD_REGEX = re.compile(r"\b[A-Z]{4,}\b")

SHORTENER_DOMAINS = {
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "goo.gl",
    "ow.ly",
    "is.gd",
    "buff.ly",
    "rebrand.ly",
}

LOTTERY_KEYWORDS = {"win", "winner", "prize", "jackpot", "selected", "claim", "draw"}
PHISHING_KEYWORDS = {"verify", "account", "password", "login", "bank", "security", "confirm", "update"}
FINANCIAL_KEYWORDS = {"cash", "loan", "credit", "refund", "payment", "transfer", "bitcoin"}
MARKETING_KEYWORDS = {"offer", "discount", "sale", "deal", "promo", "exclusive", "limited", "free"}
URGENCY_KEYWORDS = {"urgent", "immediately", "act now", "final notice", "today only", "now"}
HAM_KEYWORDS = {"lunch", "meeting", "project", "tomorrow", "thanks", "family", "coffee", "class"}

ALL_SPAM_KEYWORDS = LOTTERY_KEYWORDS | PHISHING_KEYWORDS | FINANCIAL_KEYWORDS | MARKETING_KEYWORDS | URGENCY_KEYWORDS


@dataclass(frozen=True)
class FeatureSet:
    normalized_text: str
    urls: list[str]
    phone_numbers: list[str]
    currency_symbols: list[str]
    lottery_keywords: list[str]
    phishing_keywords: list[str]
    financial_keywords: list[str]
    marketing_keywords: list[str]
    urgency_keywords: list[str]
    ham_keywords: list[str]
    uppercase_ratio: float
    uppercase_words: list[str]
    excessive_uppercase: bool
    repeated_punctuation: bool
    shortened_links: list[str]
    suspicious_link_patterns: list[str]


def _detect_keywords(normalized_text: str, candidates: set[str]) -> list[str]:
    return sorted(keyword for keyword in candidates if keyword in normalized_text)


def _detect_suspicious_link_patterns(normalized_text: str, urls: list[str]) -> list[str]:
    patterns: list[str] = []

    for url in urls:
        lowered_url = url.lower()
        if any(domain in lowered_url for domain in SHORTENER_DOMAINS):
            patterns.append("shortened-link")
        if re.search(r"https?://\d{1,3}(?:\.\d{1,3}){3}", lowered_url):
            patterns.append("ip-address-link")
        if any(token in lowered_url for token in ("login", "verify", "secure", "update-account")):
            patterns.append("credential-harvest-pattern")

    if "@" in normalized_text and urls:
        patterns.append("misleading-at-symbol")

    return sorted(set(patterns))


def extract_features(text: str) -> FeatureSet:
    normalized_text = text.strip().lower()
    urls = URL_REGEX.findall(text)
    phone_numbers = PHONE_REGEX.findall(text)
    currency_symbols = CURRENCY_REGEX.findall(text)
    uppercase_words = UPPERCASE_WORD_REGEX.findall(text)
    repeated_punctuation = bool(REPEATED_PUNCTUATION_REGEX.search(text))

    letters = [character for character in text if character.isalpha()]
    uppercase_letters = [character for character in letters if character.isupper()]
    uppercase_ratio = (len(uppercase_letters) / len(letters)) if letters else 0.0
    excessive_uppercase = uppercase_ratio >= 0.35 or len(uppercase_words) >= 2

    lottery_keywords = _detect_keywords(normalized_text, LOTTERY_KEYWORDS)
    phishing_keywords = _detect_keywords(normalized_text, PHISHING_KEYWORDS)
    financial_keywords = _detect_keywords(normalized_text, FINANCIAL_KEYWORDS)
    marketing_keywords = _detect_keywords(normalized_text, MARKETING_KEYWORDS)
    urgency_keywords = _detect_keywords(normalized_text, URGENCY_KEYWORDS)
    ham_keywords = _detect_keywords(normalized_text, HAM_KEYWORDS)
    suspicious_link_patterns = _detect_suspicious_link_patterns(normalized_text, urls)

    shortened_links = [
        url
        for url in urls
        if any(domain in url.lower() for domain in SHORTENER_DOMAINS)
    ]

    return FeatureSet(
        normalized_text=normalized_text,
        urls=urls,
        phone_numbers=phone_numbers,
        currency_symbols=currency_symbols,
        lottery_keywords=lottery_keywords,
        phishing_keywords=phishing_keywords,
        financial_keywords=financial_keywords,
        marketing_keywords=marketing_keywords,
        urgency_keywords=urgency_keywords,
        ham_keywords=ham_keywords,
        uppercase_ratio=uppercase_ratio,
        uppercase_words=uppercase_words,
        excessive_uppercase=excessive_uppercase,
        repeated_punctuation=repeated_punctuation,
        shortened_links=shortened_links,
        suspicious_link_patterns=suspicious_link_patterns,
    )
