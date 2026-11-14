from dataclasses import dataclass


@dataclass(frozen=True)
class AssignmentReason:
    """Why one assignment was made, as a person reads it after the assignee's name, and the ref of the row that
    made it when that row still exists."""

    text: str
    ref: str | None
