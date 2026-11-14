from dataclasses import dataclass

from engine.command.command import Command
from core.modules.sharing.models.share_comment import ShareComment


@dataclass(frozen=True)
class LeaveShareComment(Command[ShareComment]):
    """A visitor comments on what a link shows, under a name of their own."""

    link_id: int
    visitor_name: str
    text: str
