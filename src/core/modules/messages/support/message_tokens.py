import re
from collections import defaultdict

TOKEN_PATTERN = re.compile(r"[^\W_]+", re.UNICODE)
NUMBERS = re.compile(r"\b\d+\b")
FILLER_TOKENS = frozenset("""a an the and or but of on in at to for from with by is are was were be been it its this that these
those i i'm im you we they he she my your our their as so then than now still just also not no yes into about after before
once there here has have had do does did will would can could all any one more what which who when while up out over only""".split())
TEXT_PARTS = 4
MAX_PART_DISTANCE = 1


class MessageTokens:
    """The words of a chat message, and how much of a new message an earlier one already said: the share of
    the new message's content words, the words left after common ones such as the, on and is, that the
    earlier one holds in about the same part of its text, the same quarter or the one next to it."""

    @staticmethod
    def tokens(text: str) -> list[str]:
        return [word.lower() for word in TOKEN_PATTERN.findall(text)]

    @classmethod
    def content_tokens(cls, text: str) -> list[str]:
        return [word for word in cls.tokens(text) if word not in FILLER_TOKENS]

    @classmethod
    def repeated_share(cls, previous: str, text: str) -> float:
        previous_parts, new = cls.word_parts(previous), cls.content_tokens(text)
        if not new:
            return 0.0
        return sum(cls.is_close(previous_parts[word], cls.part(place, len(new))) for place, word in enumerate(new)) / len(new)

    @classmethod
    def word_parts(cls, text: str) -> defaultdict[str, set[int]]:
        tokens, parts = cls.content_tokens(text), defaultdict(set)
        for place, word in enumerate(tokens):
            parts[word].add(cls.part(place, len(tokens)))
        return parts

    @staticmethod
    def part(place: int, count: int) -> int:
        return place * TEXT_PARTS // count

    @staticmethod
    def is_close(parts: set[int], part: int) -> bool:
        return any(abs(part - candidate) <= MAX_PART_DISTANCE for candidate in parts)

    @staticmethod
    def adds_number(previous: str, text: str) -> bool:
        return not set(NUMBERS.findall(text)) <= set(NUMBERS.findall(previous))
