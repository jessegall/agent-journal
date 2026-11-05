from dataclasses import dataclass, replace

BULLET_STARTS = ("- ", "* ")


@dataclass(frozen=True)
class Section:
    """One section of a text: its number, its heading, its lines and the heading line as it is written."""

    number: int
    heading: str
    lines: tuple[str, ...]
    heading_line: str | None = None

    def with_line(self, line: str) -> "Section":
        return replace(self, lines=(*self.lines, line))

    def with_text(self, text: str) -> "Section":
        lines = text.strip().splitlines()
        if lines and lines[0].startswith("#"):
            return replace(self, heading_line=lines[0], lines=("", *lines[1:], ""))
        return replace(self, lines=("", *lines, ""))

    def all_lines(self) -> tuple[str, ...]:
        return self.lines if self.heading_line is None else (self.heading_line, *self.lines)

    def bullets(self) -> tuple[str, ...]:
        return tuple(line for line in self.lines if line.startswith(BULLET_STARTS))
