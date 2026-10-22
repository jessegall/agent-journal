import re


class Tags:
    """How a command tag is written: opening a line of the turn, as [!name], [!name:N], [!name:N,M] or [!name="text"], optionally after > or **. One anywhere else is text."""

    TAG_PATTERN = re.compile(r'^[ \t]*(?:>\s?)?(?:\*\*)?\[!([a-z]+)(?::([0-9]+(?:,[0-9]+)*)|="([^"]*)")?\](?:\*\*)?[ \t]*', re.MULTILINE)
    SILENT_TAGS = ("log",)

    @classmethod
    def tags(cls, text: str) -> list[tuple[str, str, str]]:
        return [(name, numbers, argument) for name, numbers, argument in cls.TAG_PATTERN.findall(text)]

    @classmethod
    def visible(cls, text: str) -> str:
        return cls.TAG_PATTERN.sub("", text).strip()

    @classmethod
    def hidden(cls, text: str) -> bool:
        return any(name in cls.SILENT_TAGS or (name == "reply" and numbers) for name, numbers, _ in cls.tags(text))
