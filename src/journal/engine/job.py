from typing import ClassVar


class Job:
    """Work done on a schedule by the job runner: one tick every interval_seconds, on the runner's thread, never on a request's."""

    interval_seconds: ClassVar[float]

    def tick(self, time: float) -> None:
        raise NotImplementedError
