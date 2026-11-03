import re
from enum import StrEnum


class TriggerMatch(StrEnum):
    """How a trigger's words are looked for in a text, capitals ignored: as part of it, as a whole word, or as a
    regular expression."""

    PART = "part"
    WORD = "word"
    PATTERN = "pattern"

    def finds(self, phrase: str, text: str) -> bool:
        if self is TriggerMatch.PART:
            return phrase.lower() in text.lower()
        pattern = phrase if self is TriggerMatch.PATTERN else rf"\b{re.escape(phrase)}\b"
        try:
            return re.search(pattern, text, re.IGNORECASE) is not None
        except re.error:
            return False
