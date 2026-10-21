import time as timing

VIEWER_WINDOW_SECONDS = 15.0
VIEWER = "x-journal-viewer"


class ViewerPresence:
    """When a viewer tab last asked the journal anything, kept in memory: a launch asks it before opening a new tab."""

    def __init__(self) -> None:
        self.time = 0.0

    def saw(self, headers: dict) -> None:
        if headers.get(VIEWER):
            self.time = timing.time()

    def open(self) -> bool:
        return timing.time() - self.time < VIEWER_WINDOW_SECONDS
