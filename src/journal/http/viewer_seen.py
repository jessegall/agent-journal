import time

OPEN_WITHIN = 15.0
"""A tab that asked the journal something this recently is still open: an open viewer polls every few seconds."""


class ViewerSeen:
    """When a viewer tab last asked the journal anything, kept in memory: a launch asks it before opening a new tab."""

    def __init__(self) -> None:
        self.at = 0.0

    def saw(self, path: str) -> None:
        if path.startswith("/api/"):
            self.at = time.time()

    def open(self) -> bool:
        return time.time() - self.at < OPEN_WITHIN
