import re
from dataclasses import dataclass
from typing import ClassVar

NAMED = re.compile(r"\bmessages? (\d+(?:, \d+)*)")


@dataclass(frozen=True)
class TypedLine:
    """A line typed into an agent's terminal, waiting for the prompt hook that proves it arrived."""

    LONGEST: ClassVar[int] = 600
    """The most characters a typed line holds: a longer one the agent's program takes in as pasted text, which never matches it, or in pieces."""
    PIECE: ClassVar[int] = 40
    """The fewest characters a prompt holds to count as a piece of a typed line, so a short answer of the user's that happens to sit inside one stays the user's."""

    environment_id: int
    line: str
    at: float
    tries: int = 1

    @classmethod
    def cut(cls, line: str) -> str:
        """The line as it may be typed: cut short, marked so, when it is too long for one line."""
        return line if len(line) <= cls.LONGEST else f"{line[:cls.LONGEST - 4]} ..."

    def messages_named(self) -> set[int]:
        """The messages a new-message line names by number, so the message being read can stand for the line's arrival."""
        return {int(n) for found in NAMED.findall(self.line) for n in found.split(", ")}

    def holds(self, prompt: str) -> bool:
        """Whether the prompt is this line, or a piece of it the terminal kept, its line breaks aside."""
        words = " ".join(prompt.split())
        return words == self.line or (len(words) >= self.PIECE and words in self.line)
