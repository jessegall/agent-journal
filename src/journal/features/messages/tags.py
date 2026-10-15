import re


class Tags:
    """How a command tag is written: opening a line of the turn, as [!name], [!name:N], [!name:N,M] or [!name="text"], optionally after > or **. One anywhere else is text."""

    CARRIED = re.compile(r'^[ \t]*(?:>\s?)?(?:\*\*)?\[!([a-z]+)(?::([0-9]+(?:,[0-9]+)*)|="([^"]*)")?\](?:\*\*)?[ \t]*', re.MULTILINE)
    QUIET = ("log",)
    """Tags whose turn belongs only to the row they write, and never also posts as a message; a reply is the chat itself, so it is quiet too when it names a message."""

    @classmethod
    def carried(cls, text: str) -> list[tuple[str, str, str]]:
        """Each tag as (name, numbers, text), in the order written."""
        return [(name, numbers, argument) for name, numbers, argument in cls.CARRIED.findall(text)]

    @classmethod
    def visible(cls, text: str) -> str:
        """The turn's words as they reach the chat, its tags taken out."""
        return cls.CARRIED.sub("", text).strip()

    @classmethod
    def kept_out(cls, text: str) -> bool:
        return any(name in cls.QUIET or (name == "reply" and numbers) for name, numbers, _ in cls.carried(text))
