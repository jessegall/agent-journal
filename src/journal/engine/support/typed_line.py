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
    at: float
    tries: int = 1

    @classmethod
    def cut(cls, line: str) -> str:
        return line if len(line) <= cls.LONGEST else f"{line[:cls.LONGEST - 4]} ..."

    def messages_named(self) -> set[int]:
        return {int(n) for found in NAMED.findall(self.line) for n in found.split(", ")}

    def holds(self, prompt: str) -> bool:
        words = " ".join(prompt.split())
        return words == self.line or (len(words) >= self.PIECE and words in self.line)
