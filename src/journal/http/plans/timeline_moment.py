from dataclasses import dataclass


@dataclass(frozen=True)
class TimelineMoment:
    """One thing that happened on a plan's task: when, in seconds, what (started, log, ended or done), the task and what was said."""

    time: float
    kind: str
    task: int
    title: str
    text: str
