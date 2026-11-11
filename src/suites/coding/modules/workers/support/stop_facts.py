from dataclasses import dataclass

from suites.coding.modules.workers.models.enums.stop_reading import StopReading


@dataclass(frozen=True)
class StopFacts:
    """What is known about a worker at the end of a turn with tasks left, and the one reading that follows:
    a person's stop first, then work that still goes, a failed launch, a stop nobody resumes, the resume
    limit, and a resume with the program ready or still starting."""

    is_busy: bool
    is_person_stop: bool
    has_launch_failed: bool
    is_delegated: bool
    is_resume_limit_reached: bool
    has_requested_help: bool
    is_program_ready: bool
    task_names: str

    def reading(self) -> StopReading:
        if self.is_person_stop:
            return StopReading.PERSON_STOP
        if self.is_busy:
            return StopReading.BUSY
        if self.has_launch_failed:
            return StopReading.LAUNCH_FAILURE
        if not self.is_delegated or self.has_requested_help:
            return StopReading.STOPPED
        if self.is_resume_limit_reached:
            return StopReading.RESUME_LIMIT
        return StopReading.RESUMED if self.is_program_ready else StopReading.RESUMED_PROGRAM_STARTING
