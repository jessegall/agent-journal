from journal.features.plans.support.review_rounds import ReviewRounds
from journal.http.support.model_fields import ModelFields
from journal.models.phase_tasks import PhaseTasks
from journal.models.plan import Plan
from journal.models.plan_state import PlanState
from journal.repositories.plan_reviews import PlanReviews
from journal.repositories.plans import Plans
from journal.repositories.workers import Workers


class PlanOutline:
    """A plan with its phases, each with its task numbers in order, the tasks under no phase, the phase in hand, whether it stands at a checkpoint for the user, whether a worker holds one of its tasks, and its review rounds, newest first, each with the reports it filed; a closed plan is read from its links alone, since none of that turns on its tasks' rows."""

    def __init__(self, plans: Plans, workers: Workers, reviews: PlanReviews, rounds: ReviewRounds) -> None:
        self.plans, self.workers, self.reviews, self.rounds = plans, workers, reviews, rounds

    def build(self, plan: Plan) -> dict:
        if plan.state.is_closed():
            return self.closed_outline(plan)
        return self.open_outline(plan)

    def open_outline(self, plan: Plan) -> dict:
        tasks = self.plans.plan_tasks(plan)
        phased = self.plans.phased(plan)
        phases = [{**ModelFields.build(phase.phase), "task_ids": [t.id for t in phase.tasks]} for phase in phased]
        checkpoint_pause = plan.state == PlanState.STARTED and plan.checkpoint_phase(phased) is not None
        return self.outline(plan, [t.id for t in tasks], phases, plan.current_phase(phased), checkpoint_pause, bool(self.workers.containing({t.row_id for t in tasks})))

    def closed_outline(self, plan: Plan) -> dict:
        phases = self.plans.plan_phases(plan)
        links = self.plans.phase_links(phases)
        listed = [{**ModelFields.build(phase), "task_ids": [link.source.id for link in links if link.target.id == phase.id]} for phase in phases]
        return self.outline(plan, self.plans.plan_task_ids(plan), listed, len(phases) or 1, False, False)

    def outline(self, plan: Plan, task_ids: list[int], phases: list[dict], current_phase: int, checkpoint_pause: bool, is_delegated: bool) -> dict:
        members = {n for phase in phases for n in phase["task_ids"]}
        return {**ModelFields.build(plan), "task_ids": task_ids, "phases": phases, "unphased_task_ids": [n for n in task_ids if n not in members],
                "current_phase": current_phase, "held": checkpoint_pause, "delegated": is_delegated,
                "reviews": [{**ModelFields.build(review), "report_ids": self.rounds.report_ids(review)} for review in self.reviews.reviews(plan)]}
