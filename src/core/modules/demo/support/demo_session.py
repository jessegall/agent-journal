from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class DemoSession:
    """A scratch journal with a server running: where it is, the server's pid and the link that logs a user
    in."""

    folder: Path
    pid: int
    link: str
