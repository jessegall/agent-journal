from dataclasses import dataclass

from engine.command.command import Command
from core.modules.reviews.models.review import Review


@dataclass(frozen=True)
class RecordReview(Command[Review]):
    lock = True

    report: str
    review_id: int | None = None
