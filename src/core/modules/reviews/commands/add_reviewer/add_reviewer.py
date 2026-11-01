from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.reviews.models.reviewer import Reviewer


@dataclass(frozen=True)
class AddReviewer(Command[Reviewer]):
    """Starts a reviewer: an agent of role reviewer, and the reviewer row with its number."""
