from dataclasses import dataclass


@dataclass(frozen=True)
class PlanEdit:
    """A journal line that changes a plan, such as task edit, and the number of the row it names."""

    line: str
    row_id: int
