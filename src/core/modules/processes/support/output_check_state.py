from dataclasses import dataclass


@dataclass(frozen=True)
class OutputCheckState:
    """The asks of a run that its agent has not answered, and the moment of the last ask or, when none is
    unanswered, of the last answer; zero for a run never asked."""

    unanswered: int
    request_seconds: float

    def waited_enough(self, clock_seconds: float, hang_seconds: int, check_seconds: int) -> bool:
        return clock_seconds - self.request_seconds >= (hang_seconds if self.unanswered else check_seconds)
