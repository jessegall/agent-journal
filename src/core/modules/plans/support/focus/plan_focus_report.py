from core.modules.agents.models.agent import Agent
from core.modules.plans.models.enums.focus_source import FocusSource
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.focus.plan_focus import PlanFocus
from core.modules.plans.support.focus.plan_unblockers import PlanUnblockers

SOURCE_TEXTS = {FocusSource.DEFAULT: "the default, the oldest started plan with work you can take", FocusSource.EXPLICIT: "you set it"}
NO_FOCUS = "no started plan has work you can take"
OTHER_PLANS = "other started plans:"


class PlanFocusReport:
    """Writes the lines an agent reads about its plan focus: the plan in focus and where the focus comes from,
    the tasks that plan waits on, and each other started plan with what it waits on."""

    def __init__(self, focus: PlanFocus, unblockers: PlanUnblockers) -> None:
        self.focus, self.unblockers = focus, unblockers

    def lines(self, agent: Agent) -> list[str]:
        current = self.focus.current(agent)
        other_plans = [plan for plan in self.focus.started_plans() if current is None or plan.id != current.plan.id]
        lines = [NO_FOCUS] if current is None else [f"plan {current.plan.id} is your focus: {SOURCE_TEXTS[current.source]}", *self.focus_lines(current.plan, agent)]
        if other_plans:
            lines.append(OTHER_PLANS)
        return [*lines, *(line for plan in other_plans for line in self.other_plan_lines(plan, agent))]

    def focus_lines(self, plan: Plan, agent: Agent) -> list[str]:
        unblockers = self.unblockers.unblockers(plan.id, agent)
        takeable = sorted(unblockers.candidates, key=lambda candidate: (-candidate.unlocks, candidate.task_id))
        return [*(f"task {candidate.task_id} holds back {self.task_count(candidate.unlocks)} of plan {plan.id}: you can take it" for candidate in takeable),
                *(f"it waits on task {line.task_id}, {line.text}" for line in unblockers.waiting)]

    def other_plan_lines(self, plan: Plan, agent: Agent) -> list[str]:
        if self.focus.is_workable(plan.id, agent):
            return [f"plan {plan.id}: has work you can take"]
        waiting = self.unblockers.unblockers(plan.id, agent).waiting
        return [f"plan {plan.id}: waits on task {line.task_id}, {line.text}" for line in waiting] or [f"plan {plan.id}: has no task you can take"]

    @staticmethod
    def task_count(count: int) -> str:
        return "1 task" if count == 1 else f"{count} tasks"
