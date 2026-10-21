import re
from dataclasses import dataclass
from typing import ClassVar

NAMED = re.compile(r"\bmessages? (\d+(?:, \d+)*)")


@dataclass(frozen=True)
class TypedLine:
    """A line typed into an agent's terminal, waiting for the prompt hook that proves it arrived."""

    LONGEST: ClassVar[int] = 600
    PIECE: ClassVar[int] = 40

    environment_id: int
    line: str
    time: float
    tries: int = 1

    @classmethod
    def cut(cls, line: str) -> str:
        return line if len(line) <= cls.LONGEST else f"{line[:cls.LONGEST - 4]} ..."

    def messages_named(self) -> set[int]:
        return {int(n) for rows in NAMED.findall(self.line) for n in rows.split(", ")}

    def holds(self, prompt: str) -> bool:
        text = " ".join(prompt.split())
        return text == self.line or (len(text) >= self.PIECE and text in self.line)
