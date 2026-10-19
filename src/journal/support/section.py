from dataclasses import dataclass


@dataclass(frozen=True)
class Section:
    """One part of a markdown text under its heading, numbered from 1; the text before the first heading is part 0."""

    number: int
    heading: str
    lines: tuple[str, ...]

    def bullets(self) -> list[str]:
        return [line.strip() for line in self.lines if line.lstrip().startswith(("- ", "* "))]

    def outline_line(self) -> str:
        return f"{self.number:>3}  {self.heading}  ({len(self.lines)} lines)"
