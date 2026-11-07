import re

WORDS = re.compile(r"[^\W_]+", re.UNICODE)


class WordDistance:
    """How alike two texts are, by the Levenshtein distance over their words: 1.0 for the same words in the same
    order, 0.0 for nothing in common, normalised by the longer text's word count."""

    @staticmethod
    def words(text: str) -> list[str]:
        return [word.lower() for word in WORDS.findall(text)]

    @classmethod
    def similarity(cls, first: str, second: str) -> float:
        first_words, second_words = cls.words(first), cls.words(second)
        longest = max(len(first_words), len(second_words))
        if longest == 0:
            return 1.0
        return 1.0 - cls.distance(first_words, second_words) / longest

    @staticmethod
    def distance(first: list[str], second: list[str]) -> int:
        previous = list(range(len(second) + 1))
        for row, word in enumerate(first, start=1):
            current = [row]
            for column, other in enumerate(second, start=1):
                current.append(min(previous[column] + 1, current[column - 1] + 1, previous[column - 1] + (word != other)))
            previous = current
        return previous[-1]
