import time

OPEN_WITHIN = 15.0
VIEWER = "x-journal-viewer"


class ViewerSeen:
    """When a viewer tab last asked the journal anything, kept in memory: a launch asks it before opening a new tab."""

    def __init__(self) -> None:
        self.at = 0.0

    def saw(self, headers: dict) -> None:
        if headers.get(VIEWER):
            self.at = time.time()

    def open(self) -> bool:
        return time.time() - self.at < OPEN_WITHIN
