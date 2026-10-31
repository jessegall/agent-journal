from dataclasses import dataclass, replace

BULLET_STARTS = ("- ", "* ")


@dataclass(frozen=True)
class Section:
    """One section of a text: its number, its heading and its lines."""

    number: int
    heading: str
    lines: tuple[str, ...]

    def with_line(self, line: str) -> "Section":
        return replace(self, lines=(*self.lines, line))

    def bullets(self) -> tuple[str, ...]:
        return tuple(line for line in self.lines if line.startswith(BULLET_STARTS))
