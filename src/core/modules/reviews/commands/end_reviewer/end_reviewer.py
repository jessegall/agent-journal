from dataclasses import dataclass

from core.base.command.move_command import MoveCommand
from core.modules.reviews.models.lifecycles.reviewer_lifecycle import ReviewerLifecycle
from core.modules.reviews.models.reviewer import Reviewer


@dataclass(frozen=True)
class EndReviewer(MoveCommand[Reviewer]):
    move = ReviewerLifecycle.end
