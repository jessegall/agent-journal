from dataclasses import dataclass

from core.base.command.make_command import MakeCommand
from core.modules.reviews.models.review import Review


@dataclass(frozen=True)
class RequestReview(MakeCommand[Review]):
    subject_model: str
    subject_id: int
    requester_id: int
    point_count: int
    brief: str = ""
