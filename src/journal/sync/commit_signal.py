import threading


class CommitSignal:
    """Rung when a commit has queued a change for the team server, so the sync client sends it at once instead of at its next look."""

    def __init__(self) -> None:
        self.event = threading.Event()

    def ring(self) -> None:
        self.event.set()

    def wait(self, seconds: float) -> None:
        self.event.wait(seconds)
        self.event.clear()
