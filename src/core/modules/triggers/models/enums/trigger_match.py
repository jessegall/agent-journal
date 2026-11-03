import re
from enum import StrEnum

LONGEST_PATTERN_CHARACTERS = 200
LONGEST_TEXT_CHARACTERS = 2000
NESTED_REPEAT = re.compile(r"\([^)]*[+*][^)]*\)\s*[+*{]")


class TriggerMatch(StrEnum):
    """How a trigger's words are looked for in a text, capitals ignored: as part of it, as a whole word, or as a
    regular expression, which runs on the first 2000 characters and may not repeat a repeat."""

    PART = "part"
    WORD = "word"
    PATTERN = "pattern"

    def finds(self, phrase: str, text: str) -> bool:
        if self is TriggerMatch.PART:
            return phrase.lower() in text.lower()
        pattern = phrase if self is TriggerMatch.PATTERN else rf"\b{re.escape(phrase)}\b"
        try:
            return re.search(pattern, text[:LONGEST_TEXT_CHARACTERS], re.IGNORECASE) is not None
        except re.error:
            return False

    def refuses(self, phrase: str) -> bool:
        if self is not TriggerMatch.PATTERN:
            return False
        return len(phrase) > LONGEST_PATTERN_CHARACTERS or NESTED_REPEAT.search(phrase) is not None
