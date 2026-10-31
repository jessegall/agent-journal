from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.viewer.viewer_layout import ViewerLayout


@dataclass(frozen=True)
class SaveViewerLayout(Command[ViewerLayout]):
    """Keeps the caller's layout of one page for one suite and driver in the caller's environment."""

    suite: str
    page: str
    driver: str
    layout: str
