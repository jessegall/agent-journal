from journal.models.link import Link
from journal.models.plan import Plan
from journal.models.plan_review import PlanReview
from journal.models.report import Report
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.repositories.plan_reviews import FILED, REVIEWS, PlanReviews
from journal.repositories.reports import Reports
from journal.support.actor import Actor
from journal.models.support.ref import Ref
from journal.features.workers.support.subagent_entries import SubagentEntries
from journal.support.caller import Caller


class ReviewRounds:
    """A plan's review rounds: one opens when the plan goes into review and closes when it is made ready, naming the subagents dispatched about the plan meanwhile, what the round changed and the reports filed about the plan while it ran."""

    def __init__(self, reviews: PlanReviews, links: Links, reports: Reports, subagents: SubagentEntries) -> None:
        self.reviews, self.links, self.reports, self.subagents = reviews, links, reports, subagents

    def open(self, plan: Plan, actor: Actor) -> None:
        if self.reviews.open_review(plan):
            return
        review = self.reviews.save(PlanReview(environment_id=plan.environment_id), actor)
        self.links.save(Link(source=Ref.build(review), target=Ref.build(plan), kind=REVIEWS), actor)

    def close(self, plan: Plan, changed: str, caller: Caller) -> None:
        for review in self.reviews.open_review(plan):
            dispatched = [] if caller.session is None else self.subagents.dispatches_mentioning(caller.session, f"plan {plan.id}", review.created_at.timestamp())
            self.reviews.save(review.closed(tuple(row.task for row in dispatched), changed), caller.actor)
            for report in self.recent_reports(plan, review):
                self.links.save(Link(source=Ref.build(review), target=Ref.build(report), kind=FILED), caller.actor)

    def recent_reports(self, plan: Plan, review: PlanReview) -> list[Report]:
        topic = [ref.id for ref in self.links.sources(plan, Messages.SUBJECT_LINK) if ref.type == Report.table()]
        return [report for report in self.reports.numbered(topic) if report.created_at >= review.created_at]

    def report_ids(self, review: PlanReview) -> list[int]:
        return [ref.id for ref in self.links.targets(review, FILED)]
