from dataclasses import dataclass

from server.viewer.viewer_window import ViewerWindow


@dataclass(frozen=True)
class ShareAnswer:
    """What the shell learns of the link a share session opened: the row it shows, the window that shows it,
    the environment that row lives in by name, when the link ends, if it does, and whether visitors may
    comment."""

    row_model: str
    row_id: int
    window: ViewerWindow
    environment: str
    ends_at: str | None
    comments: bool
