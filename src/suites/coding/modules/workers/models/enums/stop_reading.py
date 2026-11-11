from enum import StrEnum

from suites.coding.modules.workers.models.enums.stop_line_target import StopLineTarget


class StopReading(StrEnum):
    """What a stop of a worker with tasks left is, decided once for both the card in the chat and the line about
    it: whether a card shows, and who gets the one line of this stop."""

    BUSY = "busy"
    PERSON_STOP = "person stop"
    LAUNCH_FAILURE = "launch failure"
    RESUME_LIMIT = "resume limit"
    RESUMED_PROGRAM_STARTING = "resumed, program starting"
    RESUMED = "resumed"
    STOPPED = "stopped"

    @property
    def shows_card(self) -> bool:
        return self is not StopReading.BUSY

    @property
    def line_target(self) -> StopLineTarget | None:
        return LINE_TARGETS[self]

    @property
    def resumes_worker(self) -> bool:
        return self in (StopReading.RESUMED, StopReading.RESUMED_PROGRAM_STARTING)


LINE_TARGETS = {
    StopReading.BUSY: None,
    StopReading.PERSON_STOP: None,
    StopReading.LAUNCH_FAILURE: StopLineTarget.MAIN_AGENT,
    StopReading.RESUME_LIMIT: StopLineTarget.MAIN_AGENT,
    StopReading.RESUMED_PROGRAM_STARTING: StopLineTarget.MERGER,
    StopReading.RESUMED: StopLineTarget.MERGER,
    StopReading.STOPPED: StopLineTarget.MERGER,
}
