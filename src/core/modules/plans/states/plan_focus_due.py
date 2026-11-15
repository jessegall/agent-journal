from collections.abc import Sequence

from engine.driver.agent_hook import AgentHook
from engine.driver.agent_state import AgentState
from engine.enums.state_tier import StateTier
from engine.driver.open_row import OpenRow
from core.modules.tasks.models.task import Task
from core.modules.plans.rules.plan_focus_rule import PlanFocusRule
from core.modules.plans.support.focus.new_focus_places import NewFocusPlaces

PLAN_START_TABLE = "plan-start"


class PlanFocusDue(AgentState):
    """An agent started a plan task since the focus rule last answered it, or starts a plan with this very
    command: the rule that names the agent's plan focus is asked in its own place only then. It opens
    exactly where the rule's first return would not stop it."""

    name = "plans.focus-due"
    tier = StateTier.IN_PLACE
    rules = [PlanFocusRule]

    def __init__(self, new_places: NewFocusPlaces) -> None:
        self.new_places = new_places

    def open_rows(self, hook: AgentHook) -> Sequence[OpenRow]:
        if NewFocusPlaces.starts_plan(hook.event):
            return [OpenRow(PLAN_START_TABLE, 0, hook.timestamp)]
        place = self.new_places.first(hook.event, hook.agent_id)
        return [] if place is None else [OpenRow(Task.model_name, place.task_id, hook.timestamp)]
