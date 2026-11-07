from dataclasses import dataclass

from core.modules.reviews.models.enums.point_finding import PointFinding


@dataclass(frozen=True)
class ReportedPoint:
    """One point as a report names it: its number, its finding and why."""

    number: int
    finding: PointFinding
    reason: str = ""
