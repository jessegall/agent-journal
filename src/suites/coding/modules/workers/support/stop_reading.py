from dataclasses import dataclass
from enum import StrEnum


class StopLineTarget(StrEnum):
    """Who gets the line about a worker that stopped with tasks left."""

    MERGER = "merger"
    MAIN_AGENT = "main agent"


@dataclass(frozen=True)
class StopFacts:
    """What is known about a worker at the end of a turn with tasks left."""

    is_work_under_way: bool
    is_person_stop: bool
    has_launch_failed: bool
    is_delegated: bool
    is_resume_limit_reached: bool
    has_requested_help: bool
    is_program_ready: bool


class StopReading(StrEnum):
    """What a stop of a worker with tasks left is, decided once for both the card in the chat and the line about
    it: whether a card shows, and who gets the one line of this stop."""

    WORK_UNDER_WAY = "work under way"
    PERSON_STOP = "person stop"
    LAUNCH_FAILURE = "launch failure"
    RESUME_LIMIT = "resume limit"
    RESUMED_PROGRAM_STARTING = "resumed, program starting"
    RESUMED = "resumed"
    STOPPED = "stopped"

    @classmethod
    def from_facts(cls, facts: StopFacts) -> "StopReading":
        if facts.is_person_stop:
            return cls.PERSON_STOP
        if facts.is_work_under_way:
            return cls.WORK_UNDER_WAY
        if facts.has_launch_failed:
            return cls.LAUNCH_FAILURE
        if not facts.is_delegated or facts.has_requested_help:
            return cls.STOPPED
        if facts.is_resume_limit_reached:
            return cls.RESUME_LIMIT
        return cls.RESUMED if facts.is_program_ready else cls.RESUMED_PROGRAM_STARTING

    @property
    def shows_card(self) -> bool:
        return self is not StopReading.WORK_UNDER_WAY

    @property
    def line_target(self) -> StopLineTarget | None:
        return LINE_TARGETS[self]

    @property
    def resumes_worker(self) -> bool:
        return self in (StopReading.RESUMED, StopReading.RESUMED_PROGRAM_STARTING)


LINE_TARGETS = {
    StopReading.WORK_UNDER_WAY: None,
    StopReading.PERSON_STOP: None,
    StopReading.LAUNCH_FAILURE: StopLineTarget.MAIN_AGENT,
    StopReading.RESUME_LIMIT: StopLineTarget.MAIN_AGENT,
    StopReading.RESUMED_PROGRAM_STARTING: StopLineTarget.MERGER,
    StopReading.RESUMED: StopLineTarget.MERGER,
    StopReading.STOPPED: StopLineTarget.MERGER,
}
