from dataclasses import dataclass

from engine.time.timestamp import Timestamp
from core.modules.plan_reviews.support.round_report import RoundReport
from core.modules.plan_reviews.support.round_reviewer import RoundReviewer


@dataclass(frozen=True)
class PlanRound:
    """One move of a plan to under review and back: its number, when it ran, who asked, who read it and the
    reports filed. A round still running has no end."""

    number: int
    started_at: Timestamp
    ended_at: Timestamp | None
    requester_id: int
    reviewers: tuple[RoundReviewer, ...]
    reports: tuple[RoundReport, ...]

    def json(self) -> dict[str, object]:
        return {"number": self.number, "started_at": self.started_at.text, "ended_at": self.ended_at.text if self.ended_at is not None else None, "asked_by": self.requester_id,
                "reviewers": [reviewer.json() for reviewer in self.reviewers], "reports": [report.json() for report in self.reports]}

    def line(self) -> str:
        ended = f"ended {self.ended_at.text}" if self.ended_at is not None else "running"
        return f"round {self.number}  started {self.started_at.text}  {ended}  {len(self.reviewers)} reviewers  reports: {', '.join(str(report.id) for report in self.reports) or 'none'}"
