import re
from dataclasses import dataclass
from typing import ClassVar

MESSAGES_PATTERN = re.compile(r"\bmessages? (\d+(?:, \d+)*)")


@dataclass(frozen=True)
class TypedLine:
    """A line typed into an agent's terminal, waiting for the prompt hook that proves it arrived. A line longer than a terminal takes is typed in several whole pieces, each marked, never cut short."""

    LONGEST: ClassVar[int] = 600
    SPLIT_MARGIN: ClassVar[int] = 40

    environment_id: int
    line: str
    time: float
    tries: int = 1

    @classmethod
    def split(cls, line: str, prefix: str) -> list[str]:
        segments, remainder = [], line
        while len(remainder) > cls.LONGEST:
            split_index = remainder.rfind(" ", len(prefix) + 1, cls.LONGEST)
            split_index = split_index if split_index > len(prefix) else cls.LONGEST
            segments.append(remainder[:split_index].rstrip())
            remainder = f"{prefix} {remainder[split_index:].strip()}"
        return [*segments, remainder]

    def message_numbers(self) -> set[int]:
        return {int(n) for rows in MESSAGES_PATTERN.findall(self.line) for n in rows.split(", ")}

    def contains(self, prompt: str) -> bool:
        text = " ".join(prompt.split())
        return text == self.line or (len(text) >= self.SPLIT_MARGIN and text in self.line)
