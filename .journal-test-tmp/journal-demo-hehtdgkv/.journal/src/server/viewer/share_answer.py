from dataclasses import dataclass

from core.base.registry.window_listing import WindowListing


@dataclass(frozen=True)
class ShareAnswer:
    """What the shell learns of the link a share session opened: the row it shows, the window that shows it,
    the environment that row lives in by name, when the link ends, if it does, and whether visitors may
    comment."""

    row_model: str
    row_id: int
    window: WindowListing
    environment: str
    ends_at: str | None
    comments: bool
