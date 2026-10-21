import re
from dataclasses import dataclass
from typing import ClassVar

MESSAGES_PATTERN = re.compile(r"\bmessages? (\d+(?:, \d+)*)")


@dataclass(frozen=True)
class TypedLine:
    """A line typed into an agent's terminal, waiting for the prompt hook that proves it arrived. A line longer than a terminal takes is typed in several whole pieces, each marked, never cut short."""

    LONGEST_CHARACTERS: ClassVar[int] = 600
    SPLIT_MARGIN: ClassVar[int] = 40
    SEPARATOR: ClassVar[str] = " | "

    environment_id: int
    line: str
    time: float
    tries: int = 1

    @classmethod
    def split(cls, line: str, prefix: str) -> list[str]:
        segments, remainder = [], line
        while len(remainder) > cls.LONGEST_CHARACTERS:
            segment, remainder = cls.opening_segment(remainder, prefix)
            segments.append(segment)
        return [*segments, remainder]

    @classmethod
    def opening_segment(cls, line: str, prefix: str) -> tuple[str, str]:
        if len(line) <= cls.LONGEST_CHARACTERS:
            return line, ""
        index = cls.cut_index(line, len(prefix) + 1)
        remainder = line[index:].strip().removeprefix(cls.SEPARATOR.strip()).strip()
        return line[:index].rstrip(), f"{prefix} {remainder}"

    @classmethod
    def cut_index(cls, text: str, start: int) -> int:
        separator_index = text.rfind(cls.SEPARATOR, start, cls.LONGEST_CHARACTERS)
        if separator_index > start:
            return separator_index
        space_index = text.rfind(" ", start, cls.LONGEST_CHARACTERS)
        return space_index if space_index > start else cls.LONGEST_CHARACTERS

    def message_numbers(self) -> set[int]:
        return {int(n) for rows in MESSAGES_PATTERN.findall(self.line) for n in rows.split(", ")}

    def matches_prompt(self, environment_id: int, prompt: str) -> bool:
        return self.environment_id == environment_id and self.contains(prompt)

    def contains(self, prompt: str) -> bool:
        text = " ".join(prompt.split())
        return self.line in text or (len(text) >= self.SPLIT_MARGIN and text in self.line)
