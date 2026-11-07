import re

WORDS = re.compile(r"[^\W_]+", re.UNICODE)
NUMBERS = re.compile(r"\b\d+\b")
COMMON_WORDS = frozenset("""a an the and or but of on in at to for from with by is are was were be been it its this that these
those i i'm im you we they he she my your our their as so then than now still just also not no yes into about after before
once there here has have had do does did will would can could all any one more what which who when while up out over only""".split())


class MessageWords:
    """The words of a chat message, and how much of a new message an earlier one already said: the share of the new
    message's content words, the words left after common ones such as the, on and is, that the earlier one holds."""

    @staticmethod
    def words(text: str) -> list[str]:
        return [word.lower() for word in WORDS.findall(text)]

    @classmethod
    def content_words(cls, text: str) -> list[str]:
        return [word for word in cls.words(text) if word not in COMMON_WORDS]

    @classmethod
    def already_said(cls, earlier: str, text: str) -> float:
        said, new = set(cls.content_words(earlier)), cls.content_words(text)
        if not new:
            return 0.0
        return sum(word in said for word in new) / len(new)

    @staticmethod
    def names_a_new_number(earlier: str, text: str) -> bool:
        return not set(NUMBERS.findall(text)) <= set(NUMBERS.findall(earlier))
