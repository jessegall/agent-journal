from dataclasses import dataclass

from core.base.command.move_command import MoveCommand
from core.modules.reviews.models.lifecycles.review_lifecycle import ReviewLifecycle
from core.modules.reviews.models.review import Review


@dataclass(frozen=True)
class AbandonReview(MoveCommand[Review]):
    move = ReviewLifecycle.abandon
