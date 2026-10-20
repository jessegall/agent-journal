import re


class WordOverlap:
    """How much of one text another already says: the share of its words of four letters or more that the other holds too."""

    WORD = re.compile(r"[a-z0-9']{4,}")

    @classmethod
    def share(cls, text: str, other: str) -> float:
        words = set(cls.WORD.findall(text.lower()))
        if not words:
            return 0.0
        return len(words & set(cls.WORD.findall(other.lower()))) / len(words)
