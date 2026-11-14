from collections.abc import Sequence

NOTHING_RUNNING = "nothing running, so the lane is full of waiting tickets"


class ExecutionWaitError(Exception):
    """A wait for a place or for the write turn ran past its limit; it names what held the journal."""

    @classmethod
    def waited(cls, seconds: float, holders: Sequence[str]) -> "ExecutionWaitError":
        return cls(f"the journal was busy for {seconds:.1f} seconds: waiting for {'; '.join(holders) or NOTHING_RUNNING}")
