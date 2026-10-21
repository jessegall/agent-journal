from journal.features.plans.support.review_rounds import ReviewRounds
from journal.http.support.model_fields import ModelFields
from journal.models.plan import Plan
from journal.models.plan_state import PlanState
from journal.repositories.plan_reviews import PlanReviews
from journal.repositories.plans import Plans
from journal.repositories.workers import Workers


class PlanOutline:
    """A plan with its phases, each with its tasks in order, the tasks under no phase, the phase in hand, whether it stands at a checkpoint for the user, whether a worker holds one of its tasks, its reviewers out, and its review rounds, newest first, each with the reports it filed."""

    def __init__(self, plans: Plans, workers: Workers, reviews: PlanReviews, rounds: ReviewRounds) -> None:
        self.plans, self.workers, self.reviews, self.rounds = plans, workers, reviews, rounds

    def build(self, plan: Plan) -> dict:
        tasks = self.plans.plan_tasks(plan)
        phased = self.plans.phased(plan)
        phases = [{**ModelFields.build(phase.phase), "task_ids": [t.id for t in phase.tasks]} for phase in phased]
        under_a_phase = {id for phase in phases for id in phase["task_ids"]}
        return {**ModelFields.build(plan), "task_ids": [t.id for t in tasks], "phases": phases, "unphased_task_ids": [t.id for t in tasks if t.id not in under_a_phase],
                "current_phase": plan.current_phase(phased), "held": plan.state == PlanState.STARTED and plan.checkpoint_phase(phased) is not None,
                "delegated": bool(self.workers.containing({t.id for t in tasks})),
                "reviews": [{**ModelFields.build(review), "report_ids": self.rounds.report_ids(review)} for review in self.reviews.reviews(plan)]}
