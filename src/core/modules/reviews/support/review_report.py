import re
from dataclasses import dataclass

from core.modules.reviews.models.enums.point_finding import PointFinding
from core.modules.reviews.support.reported_point import ReportedPoint

# a report's lines, one per point and one for the tests, written on lines of their own or as sentences one after another
LINE_BREAK = re.compile(r"\n|(?<=\.)\s+(?=\d+\s*[.:)]?\s+(?:passed|short|undecided)\b|tests?\b)", re.IGNORECASE)
POINT = re.compile(r"^\s*(?:point\s+)?(\d+)\s*[.:)]?\s+(passed|short|undecided)\b[\s:,.-]*(.*?)\.?\s*$", re.IGNORECASE)


@dataclass(frozen=True)
class ReviewReport:
    """A reviewer's report as written, and the points it names; it approves when it passes every point of the
    brief, and is undecided when no point is short but one is undecided or not named."""

    text: str

    def points(self) -> tuple[ReportedPoint, ...]:
        matches = (POINT.match(line) for line in LINE_BREAK.split(self.text))
        return tuple(ReportedPoint(int(match[1]), PointFinding(match[2].lower()), match[3]) for match in matches if match)

    def judged(self, finding: PointFinding) -> tuple[ReportedPoint, ...]:
        return tuple(point for point in self.points() if point.finding == finding)

    def is_approved(self, count: int) -> bool:
        return {point.number for point in self.judged(PointFinding.PASSED)} >= set(range(1, count + 1)) and not self.judged(PointFinding.SHORT)

    def is_undecided(self, count: int) -> bool:
        return not self.judged(PointFinding.SHORT) and not self.is_approved(count)
