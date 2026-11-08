import re
from collections import defaultdict

WORDS = re.compile(r"[^\W_]+", re.UNICODE)
NUMBERS = re.compile(r"\b\d+\b")
COMMON_WORDS = frozenset("""a an the and or but of on in at to for from with by is are was were be been it its this that these
those i i'm im you we they he she my your our their as so then than now still just also not no yes into about after before
once there here has have had do does did will would can could all any one more what which who when while up out over only""".split())
TEXT_PARTS = 4
PARTS_APART = 1


class MessageWords:
    """The words of a chat message, and how much of a new message an earlier one already said: the share of the new
    message's content words, the words left after common ones such as the, on and is, that the earlier one holds in
    about the same part of its text, the same quarter or the one next to it."""

    @staticmethod
    def words(text: str) -> list[str]:
        return [word.lower() for word in WORDS.findall(text)]

    @classmethod
    def content_words(cls, text: str) -> list[str]:
        return [word for word in cls.words(text) if word not in COMMON_WORDS]

    @classmethod
    def already_said(cls, earlier: str, text: str) -> float:
        said, new = cls.word_parts(earlier), cls.content_words(text)
        if not new:
            return 0.0
        return sum(cls.is_near(said[word], cls.part(place, len(new))) for place, word in enumerate(new)) / len(new)

    @classmethod
    def word_parts(cls, text: str) -> defaultdict[str, set[int]]:
        words, parts = cls.content_words(text), defaultdict(set)
        for place, word in enumerate(words):
            parts[word].add(cls.part(place, len(words)))
        return parts

    @staticmethod
    def part(place: int, count: int) -> int:
        return place * TEXT_PARTS // count

    @staticmethod
    def is_near(parts: set[int], part: int) -> bool:
        return any(abs(part - other) <= PARTS_APART for other in parts)

    @staticmethod
    def names_a_new_number(earlier: str, text: str) -> bool:
        return not set(NUMBERS.findall(text)) <= set(NUMBERS.findall(earlier))
