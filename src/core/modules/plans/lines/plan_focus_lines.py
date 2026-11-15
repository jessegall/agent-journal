from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.journal.journal_home import JournalHome
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.plans.models.enums.focus_source import FocusSource
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.nudges.focus_suggested_nudge import FocusSuggestedNudge
from core.modules.plans.nudges.unfocused_task_nudge import UnfocusedTaskNudge
from core.modules.plans.support.focus.judged_focus_tasks import JudgedFocusTasks
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

    def __init__(self, queries: Queries, focus: PlanFocus, new_places: NewFocusPlaces, home: JournalHome) -> None:
        self.queries, self.focus, self.new_places = queries, focus, new_places
        self.judged = JudgedFocusTasks.shared(home)

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        if event is None:
            return []
        starts_plan = NewFocusPlaces.starts_plan(event)
        places = self.new_places.places(event, agent_id)
        if not places and not starts_plan:
            return []
        # a silent judgement records no answer, so the same started tasks come back on every hook until one changes
        task_ids = frozenset(place.task_id for place in places)
        if not starts_plan and self.judged.is_judged(agent_id, task_ids):
            return []
        self.judged.mark(agent_id, task_ids)
        agent = self.queries.query(Agent).find(agent_id)
        explicit_id = self.focus.explicit_plan_id(agent)
        if not starts_plan and all(place.plan_id == explicit_id for place in places):
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
            return [FocusSuggestedNudge.declared().nudge(plans=started_plans, focus=work.plan.id)]
        waited_ids = work.unblockers.task_ids()
        return [UnfocusedTaskNudge.declared().nudge(task=place.task_id, plan=place.plan_id, focus=work.plan.id)
                for place in places if place.plan_id != work.plan.id and place.task_id not in waited_ids]
