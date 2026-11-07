from dataclasses import dataclass

from core.modules.plan_reviews.support.plan_round import PlanRound


@dataclass(frozen=True)
class ReviewTip:
    """What the 'under review' badge of a plan tells: how many reviewers are reading it, which have reported with their
    report number and which are still reading."""

    review_round: PlanRound | None

    def lines(self) -> tuple[str, ...]:
        if self.review_round is None or not self.review_round.reviewers:
            return ("No reviewer has started reading yet",)
        filed = {report.author_id: report.id for report in self.review_round.reports}
        reviewers = self.review_round.reviewers
        reported = sum(1 for reviewer in reviewers if reviewer.agent_id in filed)
        count = f"{len(reviewers)} reviewer" if len(reviewers) == 1 else f"{len(reviewers)} reviewers"
        return (f"{count}: {reported} reported, {len(reviewers) - reported} still reading",
                *(f"{reviewer.name}: report {filed[reviewer.agent_id]}" if reviewer.agent_id in filed else f"{reviewer.name}: still reading" for reviewer in reviewers))
