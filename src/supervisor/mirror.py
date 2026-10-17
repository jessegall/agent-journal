import os
import time
from pathlib import Path

KEPT = 32 * 1024
"""The newest bytes of the agent's output the mirror keeps: enough for a menu and the lines above it."""
EVERY = 0.5
"""The least time between two writes of the mirror's file."""


class Mirror:
    """The newest output of the agent's terminal, written to a file other processes read: the supervisor carries the bytes and knows nothing of what they mean."""

    def __init__(self, path: Path) -> None:
        self.path, self._kept, self._written_at, self._changed = path, bytearray(), 0.0, False

    def keyed(self) -> None:
        """Notes that a key came from the keyboard, by touching the file beside the mirror."""
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.with_suffix(".keyed").touch()

    def add(self, data: bytes) -> None:
        self._kept += data
        del self._kept[:-KEPT]
        self._changed = True

    def flush(self) -> None:
        """Writes the kept bytes whole to the file when they changed and the last write is old enough."""
        now = time.time()
        if not self._changed or now - self._written_at < EVERY:
            return
        self.path.parent.mkdir(parents=True, exist_ok=True)
        part = self.path.with_suffix(".part")
        part.write_bytes(bytes(self._kept))
        os.replace(part, self.path)
        self._written_at, self._changed = now, False

    def close(self) -> None:
        """The mirror taken down with its supervisor, so nobody reads a screen no process shows any more."""
        self.path.unlink(missing_ok=True)
        self.path.with_suffix(".keyed").unlink(missing_ok=True)
