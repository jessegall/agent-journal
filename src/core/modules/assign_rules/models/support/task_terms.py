import re

TERM = re.compile(r"(?:[^\W_]|-)+")


def split_terms(text: str) -> list[str]:
    return [term.casefold() for term in TERM.findall(text)]


def has_phrase(text: str, phrase: str) -> bool:
    phrase_terms, text_terms = split_terms(phrase), split_terms(text)
    return any(text_terms[start:start + len(phrase_terms)] == phrase_terms for start in range(len(text_terms) - len(phrase_terms) + 1))
