from enum import StrEnum


class Submission(StrEnum):
    """What submitting a worktree's proofs came to: tests were queued, the proofs were committed and their
    tests wait for a checkpoint of the plan, or there was no test to run."""

    QUEUED = "queued"
    COMMITTED = "committed"
    UNTESTED = "untested"

    @property
    def answer_text(self) -> str:
        match self:
            case self.QUEUED:
                return "its tests are queued"
            case self.COMMITTED:
                return "the tests of its checkpoint run in the background on your commit"
            case self.UNTESTED:
                return "it has no test to run"
