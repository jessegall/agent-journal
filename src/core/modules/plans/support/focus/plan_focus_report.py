from core.modules.agents.models.agent import Agent
from core.modules.plans.models.enums.focus_source import FocusSource
from core.modules.plans.support.focus.plan_focus import PlanFocus

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
            f"plan {focus_work.plan.id} is your focus: {SOURCE_TEXTS[overview.current.source]}", *focus_work.focus_lines()]
        if overview.remaining:
            lines.append(REMAINING_PLANS_HEADING)
        return [*lines, *(line for work in overview.remaining for line in work.summary_lines())]
