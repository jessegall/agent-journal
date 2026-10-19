from journal.features.plans.support.plan_control import PlanControl
from journal.support.subagents import Subagents
from journal.http.support.model_fields import ModelFields
from journal.models.plan import Plan
from journal.models.plan_state import PlanState
from journal.repositories.agents import Agents
from journal.repositories.plans import Plans
from journal.repositories.workers import Workers


class PlanOutline:
    """A plan with its phases, each with its tasks in order, the tasks under no phase, the phase in hand, whether it holds at a checkpoint for the user, whether a worker holds one of its tasks, and its reviewers out."""

    def __init__(self, plans: Plans, control: PlanControl, workers: Workers, agents: Agents, subagents: Subagents) -> None:
        self.plans, self.control, self.workers, self.agents, self.subagents = plans, control, workers, agents, subagents

    def of(self, plan: Plan) -> dict:
        tasks = self.plans.tasks_of(plan)
        in_phases = [(phase, self.plans.tasks_in(phase)) for phase in self.plans.phases_of(plan)]
        phases = [{**ModelFields.of(phase), "task_ids": [t.id for t in held]} for phase, held in in_phases]
        phased = {id for phase in phases for id in phase["task_ids"]}
        return {**ModelFields.of(plan), "task_ids": [t.id for t in tasks], "phases": phases, "unphased_task_ids": [t.id for t in tasks if t.id not in phased],
                "current_phase": Plans.current_of([held for _, held in in_phases]), "held": plan.state == PlanState.STARTED and self.control.holds(plan),
                "delegated": bool(self.workers.holding({t.id for t in tasks})), "reviewers": self.reviewers(plan)}

    def reviewers(self, plan: Plan) -> int:
        """The plan's reviewers still out while it is in review: the subagents of the live agents whose brief names it."""
        if plan.state != PlanState.REVIEWING:
            return 0
        return sum(self.subagents.running_about(a.session, f"plan {plan.id}") for a in self.agents.in_() if a.state != "ended")
