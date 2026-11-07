from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.models.merge_followup import MergeFollowup


@dataclass(frozen=True)
class RecordFollowupStep(Command[MergeFollowup]):
    """Saves the result of one step of a merge's required commands the moment it is known."""

    followup_id: int
    index: int
    result: str
