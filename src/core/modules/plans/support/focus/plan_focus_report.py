from core.modules.agents.models.agent import Agent
from core.modules.plans.models.enums.focus_source import FocusSource
from core.modules.plans.support.focus.plan_focus import PlanFocus
from core.modules.plans.support.focus.plan_work import PlanWork

SOURCE_TEXTS = {FocusSource.DEFAULT: "the default, the oldest started plan with work you can take", FocusSource.EXPLICIT: "you set it"}
FOCUS_MISSING_TEXT = "no started plan has work you can take"
REMAINING_PLANS_HEADING = "other started plans:"


class PlanFocusReport:
    """Writes the lines an agent reads about its plan focus: the plan in focus and where the focus comes from,
    the tasks that plan waits on, and each other started plan with what it waits on."""

    def __init__(self, focus: PlanFocus) -> None:
        self.focus = focus

    def lines(self, agent: Agent) -> list[str]:
        overview = self.focus.overview(agent)
        focus_work = overview.focus_work
        lines = [FOCUS_MISSING_TEXT] if overview.current is None or focus_work is None else [
            f"plan {focus_work.plan.id} is your focus: {SOURCE_TEXTS[overview.current.source]}", *self.focus_lines(focus_work)]
        if overview.remaining:
            lines.append(REMAINING_PLANS_HEADING)
        return [*lines, *(line for work in overview.remaining for line in self.remaining_plan_lines(work))]

    def focus_lines(self, work: PlanWork) -> list[str]:
        takeable = sorted(work.unblockers.candidates, key=lambda candidate: (-candidate.unlocks, candidate.task_id))
        return [*(f"task {candidate.task_id} holds back {self.task_count(candidate.unlocks)} of plan {work.plan.id}: you can take it" for candidate in takeable),
                *(f"it waits on task {line.task_id}, {line.text}" for line in work.unblockers.waiting)]

    @staticmethod
    def remaining_plan_lines(work: PlanWork) -> list[str]:
        if work.is_workable:
            return [f"plan {work.plan.id}: has work you can take"]
        return [f"plan {work.plan.id}: waits on task {line.task_id}, {line.text}" for line in work.unblockers.waiting] or [f"plan {work.plan.id}: has no task you can take"]

    @staticmethod
    def task_count(count: int) -> str:
        return "1 task" if count == 1 else f"{count} tasks"
