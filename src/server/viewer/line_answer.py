from dataclasses import dataclass


@dataclass(frozen=True)
class LineAnswer:
    """What POST /api/line answers: the line's exit code, its JSON value when it ran, and the reason when it did not."""

    code: int
    value: object = None
    error: str = ""
