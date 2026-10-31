from dataclasses import dataclass

from core.modules.reviews.models.enums.point_verdict import PointVerdict


@dataclass(frozen=True)
class ReportedPoint:
    """One point as a report names it: its number, its verdict and why."""

    number: int
    verdict: PointVerdict
    reason: str = ""
