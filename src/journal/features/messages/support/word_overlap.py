import re


class WordOverlap:
    """How much of one text another already says: the share of its words of four letters or more that the other holds too."""

    WORD = re.compile(r"[a-z0-9']{4,}")
    FEWEST = 8
    """Words a text needs before it can be said to repeat another: a line of a few words shares them by chance."""

    @classmethod
    def share(cls, text: str, other: str) -> float:
        words = set(cls.WORD.findall(text.lower()))
        if len(words) < cls.FEWEST:
            return 0.0
        return len(words & set(cls.WORD.findall(other.lower()))) / len(words)
