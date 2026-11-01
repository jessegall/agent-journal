from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.reviews.models.review import Review


@dataclass(frozen=True)
class RecordReview(Command[Review]):
    report: str
    review_id: int | None = None
