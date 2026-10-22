import re


class Faces:
    """The faces a reaction can be, and what counts as a turn that is only a face."""

    ALL = ("👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂")
    EMOJI_PATTERN = re.compile(r"^[\s\U0001F000-\U0001FAFF\u2600-\u27BF\uFE0F\u200d]+$")

    @classmethod
    def is_face(cls, text: str) -> bool:
        return bool(text.strip()) and bool(cls.EMOJI_PATTERN.match(text))
