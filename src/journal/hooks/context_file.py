from pathlib import Path


class ContextFile:
    """Claude reports its context through its statusline script, not a hook: the script writes one file per session, and this reads the latest figure."""

    def __init__(self, home: Path) -> None: ...

    def of(self, session: str) -> float | None: ...
