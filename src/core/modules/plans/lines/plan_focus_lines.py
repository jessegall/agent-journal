from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.plans.models.enums.focus_source import FocusSource
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.agent_messages.focus_suggested_message import FocusSuggestedMessage
from core.modules.plans.agent_messages.unfocused_task_message import UnfocusedTaskMessage
from core.modules.plans.support.focus.focus_judgements import FocusJudgements
from core.modules.plans.support.focus.new_focus_places import FOCUS_RULE_NAME, NewFocusPlaces
from core.modules.plans.support.focus.plan_focus import PlanFocus

MULTIPLE_PLAN_COUNT = 2


class PlanFocusLines(EventLineSource):
    """An agent that has started a plan task since these lines last spoke to it, or that starts a plan, reads a
    line about its own plan focus, once: with two or more started plans and no focus of its own, the started
    plans and the default focus; with a focus of its own, a started task of another plan that the focus does
    not wait on. One started plan, a task outside any plan and a task the focus waits on give no line. The
    line goes to the agent that runs the tool, about its focus alone."""

    key = FOCUS_RULE_NAME
    events = [HookEventName.POST_TOOL_USE]
    agent_types = [AgentRole.MAIN.value, AgentRole.HELPER.value]

    def __init__(self, queries: Queries, focus: PlanFocus, new_places: NewFocusPlaces, judged: FocusJudgements) -> None:
        self.queries, self.focus, self.new_places, self.judged = queries, focus, new_places, judged

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        if event is None:
            return []
        is_plan_start = NewFocusPlaces.is_plan_start(event)
        places = self.new_places.places(event, agent_id)
        if not places and not is_plan_start:
            return []
        # a silent judgement records no answer, so the same started tasks come back on every hook until one changes
        task_ids = frozenset(place.task_id for place in places)
        if not is_plan_start and self.judged.is_judged(agent_id, task_ids):
            return []
        self.judged.mark(agent_id, task_ids)
        agent = self.queries.query(Agent).find(agent_id)
        explicit_id = self.focus.explicit_plan_id(agent)
        if not is_plan_start and all(place.plan_id == explicit_id for place in places):
            return []
        # one count settles most calls: with fewer than two plans to choose between there is no focus to name; a focus
        # the agent named may add an approved plan to the started ones
        if self.queries.query(Plan).filter(state=PlanState.STARTED).count() < MULTIPLE_PLAN_COUNT - (explicit_id is not None):
            return []
        overview = self.focus.overview(agent)
        work = overview.focus_work
        if work is None or overview.current is None or len(overview.started) < MULTIPLE_PLAN_COUNT:
            return []
        if overview.current.source is FocusSource.DEFAULT:
            started_plans = ", ".join(str(started.plan.id) for started in overview.started)
            return [FocusSuggestedMessage.declared().agent_message(plans=started_plans, focus=work.plan.id)]
        waited_ids = work.unblockers.task_ids()
        return [UnfocusedTaskMessage.declared().agent_message(task=place.task_id, plan=place.plan_id, focus=work.plan.id)
                for place in places if place.plan_id != work.plan.id and place.task_id not in waited_ids]
