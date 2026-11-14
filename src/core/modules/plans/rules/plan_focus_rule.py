from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.plans.models.enums.focus_source import FocusSource
from core.modules.plans.support.focus.judged_focus_tasks import JudgedFocusTasks
from core.modules.plans.support.focus.new_focus_places import FOCUS_RULE_NAME, NewFocusPlaces
from core.modules.plans.support.focus.plan_focus import PlanFocus
from engine.journal.journal_home import JournalHome
from core.modules.plans.support.plan_nudges import UNFOCUSED_TASK, FOCUS_SUGGESTED

MULTIPLE_PLAN_COUNT = 2


class PlanFocusRule(DriverRule):
    """An agent that has started a plan task since this rule last spoke to it, or that starts a plan, reads a
    line about its own plan focus, once: with two or more started plans and no focus of its own, the started
    plans and the default focus; with a focus of its own, a started task of another plan that the focus does
    not wait on. One started plan, a task outside any plan and a task the focus waits on give no line. The
    line goes to the agent that runs the tool, about its focus alone."""

    name = FOCUS_RULE_NAME
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.HELPER]
    history = True

    def __init__(self, queries: Queries, focus: PlanFocus, new_places: NewFocusPlaces, home: JournalHome) -> None:
        self.queries, self.focus, self.new_places = queries, focus, new_places
        self.judged = JudgedFocusTasks.shared(home)

    def answer(self, hook: AgentHook) -> RuleAnswer:
        starts_plan = NewFocusPlaces.starts_plan(hook)
        places = self.new_places.places(hook)
        if not places and not starts_plan:
            return RuleAnswer.allowed()
        # a silent judgement records no answer, so the same started tasks come back on every hook until one changes
        task_ids = frozenset(place.task_id for place in places)
        if not starts_plan and self.judged.is_judged(hook.agent_id, task_ids):
            return RuleAnswer.allowed()
        self.judged.mark(hook.agent_id, task_ids)
        agent = self.queries.query(Agent).find(hook.agent_id)
        explicit_id = self.focus.explicit_plan_id(agent)
        if not starts_plan and all(place.plan_id == explicit_id for place in places):
            return RuleAnswer.allowed()
        # one count settles most calls: with fewer than two plans to choose between there is no focus to name; a focus
        # the agent named may add an approved plan to the started ones
        if self.queries.query(Plan).filter(state=PlanState.STARTED).count() < MULTIPLE_PLAN_COUNT - (explicit_id is not None):
            return RuleAnswer.allowed()
        overview = self.focus.overview(agent)
        work = overview.focus_work
        if work is None or overview.current is None or len(overview.started) < MULTIPLE_PLAN_COUNT:
            return RuleAnswer.allowed()
        if overview.current.source is FocusSource.DEFAULT:
            started_plans = ", ".join(str(started.plan.id) for started in overview.started)
            return RuleAnswer.with_nudges(FOCUS_SUGGESTED.nudge(plans=started_plans, focus=work.plan.id))
        waited_ids = work.unblockers.task_ids()
        unfocused_places = [place for place in places if place.plan_id != work.plan.id and place.task_id not in waited_ids]
        return RuleAnswer.with_nudges(*(UNFOCUSED_TASK.nudge(task=place.task_id, plan=place.plan_id, focus=work.plan.id) for place in unfocused_places))
