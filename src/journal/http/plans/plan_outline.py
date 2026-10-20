from journal.features.plans.support.plan_control import PlanControl
from journal.features.plans.support.review_rounds import ReviewRounds
from journal.http.support.model_fields import ModelFields
from journal.models.plan import Plan
from journal.models.plan_state import PlanState
from journal.repositories.plan_reviews import PlanReviews
from journal.repositories.plans import Plans
from journal.repositories.workers import Workers


class PlanOutline:
    """A plan with its phases, each with its tasks in order, the tasks under no phase, the phase in hand, whether it holds at a checkpoint for the user, whether a worker holds one of its tasks, its reviewers out, and its review rounds, newest first, each with the reports it filed."""

    def __init__(self, plans: Plans, control: PlanControl, workers: Workers, reviews: PlanReviews, rounds: ReviewRounds) -> None:
        self.plans, self.control, self.workers, self.reviews, self.rounds = plans, control, workers, reviews, rounds

    def of(self, plan: Plan) -> dict:
        tasks = self.plans.tasks_of(plan)
        in_phases = [(phase, self.plans.tasks_in(phase)) for phase in self.plans.phases_of(plan)]
        phases = [{**ModelFields.of(phase), "task_ids": [t.id for t in held]} for phase, held in in_phases]
        phased = {id for phase in phases for id in phase["task_ids"]}
        return {**ModelFields.of(plan), "task_ids": [t.id for t in tasks], "phases": phases, "unphased_task_ids": [t.id for t in tasks if t.id not in phased],
                "current_phase": Plans.current_of([held for _, held in in_phases]), "held": plan.state == PlanState.STARTED and self.control.holds(plan),
                "delegated": bool(self.workers.holding({t.id for t in tasks})),
                "reviews": [{**ModelFields.of(review), "report_ids": self.rounds.report_ids(review)} for review in self.reviews.of(plan)]}

