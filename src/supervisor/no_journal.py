from pathlib import Path


class NoJournal:
    """A supervisor started by a running journal keeps none of its own: the same shape as JournalProcess, doing nothing."""

    def __init__(self, root: Path) -> None:
        self.root = root

    def start(self) -> None:
        return None

    def restart(self) -> None:
        return None

    def alive(self) -> bool:
        return True

    def keep_alive(self) -> None:
        return None

    def stop(self) -> None:
        return None
