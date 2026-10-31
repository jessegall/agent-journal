import json
import os
from pathlib import Path


class TrailLog:
    """The file each answered request appends one JSON line to, in one write, so several processes can append to
    it at once; it never rotates while writing."""

    def __init__(self, path: Path) -> None:
        self.path = path

    def write(self, fields: dict[str, object]) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        descriptor = os.open(self.path, os.O_WRONLY | os.O_APPEND | os.O_CREAT, 0o644)
        try:
            os.write(descriptor, (json.dumps(fields, separators=(",", ":")) + "\n").encode())
        finally:
            os.close(descriptor)
