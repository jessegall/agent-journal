import re
from dataclasses import dataclass
from typing import ClassVar

NAMED = re.compile(r"\bmessages? (\d+(?:, \d+)*)")


@dataclass(frozen=True)
class TypedLine:
    """A line typed into an agent's terminal, waiting for the prompt hook that proves it arrived. A line longer than a terminal takes is typed in several whole pieces, each marked, never cut short."""

    LONGEST: ClassVar[int] = 600
    PIECE: ClassVar[int] = 40

    environment_id: int
    line: str
    time: float
    tries: int = 1

    @classmethod
    def pieces(cls, line: str, mark: str) -> list[str]:
        pieces, rest = [], line
        while len(rest) > cls.LONGEST:
            at = rest.rfind(" ", len(mark) + 1, cls.LONGEST)
            at = at if at > len(mark) else cls.LONGEST
            pieces.append(rest[:at].rstrip())
            rest = f"{mark} {rest[at:].strip()}"
        return [*pieces, rest]

    def messages_named(self) -> set[int]:
        return {int(n) for rows in NAMED.findall(self.line) for n in rows.split(", ")}

    def holds(self, prompt: str) -> bool:
        text = " ".join(prompt.split())
        return text == self.line or (len(text) >= self.PIECE and text in self.line)
