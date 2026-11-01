from dataclasses import dataclass


@dataclass(frozen=True)
class ForegroundRun:
    """How long a line may run in the foreground, whether it goes to the background at once, and
    the reader an alias it runs names."""

    seconds: int
    background: bool
    reader_id: int | None = None
    aliases: tuple[str, ...] = ()
