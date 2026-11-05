from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.reviews.models.reviewer import Reviewer


@dataclass(frozen=True)
class RetireReviewer(Command[Reviewer]):
    """Lets the newest idle reviewer of the environment go and ends its agent session."""
