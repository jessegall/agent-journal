from dataclasses import dataclass

from engine.enums.work_type import WorkType


@dataclass(frozen=True)
class WorkReference:
    """The work a Working stacked state stands for: what sort of work, its row and the text that names it."""

    work_type: WorkType
    work_id: int
    text: str

    def is_job(self) -> bool:
        return self.work_type in (WorkType.JOB, WorkType.MERGE_JOB)
