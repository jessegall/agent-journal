from dataclasses import dataclass

from server.viewer.line_answer import LineAnswer


@dataclass(frozen=True)
class TimedLineAnswer:
    """A line's answer with the time that line alone took in its batch."""

    answer: LineAnswer
    duration_ms: float
