from enum import StrEnum


class Submission(StrEnum):
    """What submitting a worktree's proofs came to: tests were queued, the proofs were committed and their
    tests wait for a checkpoint of the plan, or there was no test to run."""

    QUEUED = "queued"
    COMMITTED = "committed"
    UNTESTED = "untested"
