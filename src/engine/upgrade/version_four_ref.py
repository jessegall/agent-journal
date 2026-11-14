from dataclasses import dataclass


@dataclass(frozen=True)
class VersionFourRef:
    """A version 4 link's end, written table:number, as the table and the number, which is none for text that
    names no row."""

    table: str
    number: int | None

    @classmethod
    def parsed(cls, text: str | None) -> "VersionFourRef":
        if text is None or ":" not in text:
            return cls("", None)
        table, _, number = text.partition(":")
        return cls(table, int(number) if number.isdigit() else None)
