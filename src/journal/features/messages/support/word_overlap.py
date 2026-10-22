import re


class WordOverlap:
    """How much of one text another already says: the share of its words of four letters or more that the other holds too."""

    WORD = re.compile(r"[a-z0-9']{4,}")
    FEWEST = 8

    @classmethod
    def repeats(cls, text: str, rows: list, ratio: float) -> list:
        return [row for row in rows if cls.share(text, row.text) >= ratio]

    @classmethod
    def share(cls, text: str, counterpart: str) -> float:
        terms = set(cls.WORD.findall(text.lower()))
        if len(terms) < cls.FEWEST:
            return 0.0
        return len(terms & set(cls.WORD.findall(counterpart.lower()))) / len(terms)
