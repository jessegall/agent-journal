from dataclasses import dataclass


@dataclass(frozen=True)
class PartCommand:
    """The command a part runs and the reader its alias names."""

    command: str
    named_reader_id: int | None = None
