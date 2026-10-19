import time

OPEN_WITHIN = 15.0
"""A tab that asked the journal something this recently is still open: an open viewer polls every few seconds."""
VIEWER = "x-journal-viewer"
"""The header the viewer sends on every call, so a plugin's program, the shim or the launcher's own question never counts as a tab."""


class ViewerSeen:
    """When a viewer tab last asked the journal anything, kept in memory: a launch asks it before opening a new tab."""

    def __init__(self) -> None:
        self.at = 0.0

    def saw(self, headers: dict) -> None:
        if headers.get(VIEWER):
            self.at = time.time()

    def open(self) -> bool:
        return time.time() - self.at < OPEN_WITHIN
