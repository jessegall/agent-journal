from pathlib import Path
from typing import Iterator

from journal.providers.turn import Turn


class TranscriptReader:
    """Reads the agent's own conversation file, as its provider writes it, and yields each turn once."""

    def __init__(self, path: Path) -> None: ...

    def since(self, line: int) -> Iterator[Turn]: ...
