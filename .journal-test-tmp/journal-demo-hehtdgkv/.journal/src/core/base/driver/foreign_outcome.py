from enum import StrEnum

from core.base.driver.foreign_answer import ForeignAnswer
from core.base.driver.foreign_run import ForeignRun


class ForeignOutcome(StrEnum):
    """The result a recorded project hook had on its event."""

    ALLOWED = "allowed"
    REFUSED = "refused"
    REWRITTEN = "rewritten"
    TIMEOUT = "timed_out"
    FAILED = "failed"

    @classmethod
    def detected(cls, run: ForeignRun, answer: ForeignAnswer) -> "ForeignOutcome":
        if run.timed_out:
            return cls.TIMEOUT
        if answer.refusal:
            return cls.REFUSED
        if run.exit_code != 0:
            return cls.FAILED
        if answer.updated_input:
            return cls.REWRITTEN
        return cls.ALLOWED
