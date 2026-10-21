import os
import time
from pathlib import Path

TAIL_BYTES = 32 * 1024
FLUSH_INTERVAL_SECONDS = 0.5


class ScreenCopy:
    """The newest output of the agent's terminal, written to a file other processes read: the supervisor carries the bytes and knows nothing of what they mean."""

    def __init__(self, path: Path) -> None:
        self.path, self._kept, self._written_at, self._changed = path, bytearray(), 0.0, False

    def keyed(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.with_suffix(".keyed").touch()

    def add(self, data: bytes) -> None:
        self._kept += data
        del self._kept[:-TAIL_BYTES]
        self._changed = True

    def flush(self) -> None:
        moment = time.time()
        if not self._changed or moment - self._written_at < FLUSH_INTERVAL_SECONDS:
            return
        self.path.parent.mkdir(parents=True, exist_ok=True)
        part = self.path.with_suffix(".part")
        part.write_bytes(bytes(self._kept))
        os.replace(part, self.path)
        self._written_at, self._changed = moment, False

    def close(self) -> None:
        self.path.unlink(missing_ok=True)
        self.path.with_suffix(".keyed").unlink(missing_ok=True)
