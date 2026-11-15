from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RecordUnsavedReport(Command[None]):
    """Counts a job report whose save failed (doc 1310 section 4.9); the second failure keeps the report's text
    on the job, so the helper may rest and its parent is told."""

    job_id: int
    text: str
