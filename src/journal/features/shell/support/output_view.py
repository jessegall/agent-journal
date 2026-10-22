from dataclasses import dataclass

from journal.models.message import Message

WATCH_KEY = "watch"


@dataclass(frozen=True)
class OutputView:
    """What a watch on an output shows: the lines its reader picks, or its last lines, how far its command has come, as words and as a fraction, and how it ended once it has."""

    output: int
    lines: tuple[str, ...]
    figure: str
    fraction: float
    ending: str
    reader: str = ""
    poor_line: str = ""
    empty_card: bool = False

    @classmethod
    def empty(cls) -> "OutputView":
        return cls(0, (), "", 0.0, "")

    @classmethod
    def unmeasured(cls, output: int, lines: tuple[str, ...], ending: str) -> "OutputView":
        return cls(output, lines, "", 0.0, ending)

    @classmethod
    def parsed(cls, card: Message) -> "OutputView":
        lines = card.data.get("lines") or [card.data["detail"]]
        return cls(card.data["output"], tuple(line for line in lines if line), card.data["figure"], card.data["fraction"], card.data["ending"], card.data.get("reader", ""), card.data.get("poor_line", ""), card.data.get("empty_card", False))

    @staticmethod
    def key(output: int) -> str:
        return f"{WATCH_KEY}:{output}"

    def is_watching(self) -> bool:
        return self.output > 0

    def text(self) -> str:
        return "\n".join([line for line in (self.figure, *self.lines) if line]) or "no lines yet"
