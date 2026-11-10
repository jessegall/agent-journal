from types import SimpleNamespace

from core.modules.plans.models.enums.focus_source import FocusSource
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.support.focus.plan_focus import PlanFocus
from core.modules.plans.support.unblockers.unblocker import Unblocker
from core.modules.plans.support.unblockers.unblockers import Unblockers

PLANS_MODULE = "journal.core.plans"


def agent(agent_id, role, focus_plan_id=None):
    part = {} if focus_plan_id is None else {"focus_plan": focus_plan_id}
    return SimpleNamespace(id=agent_id, role=role, metadata=SimpleNamespace(module_part=lambda module: part if module == PLANS_MODULE else {}))


MAIN = agent(1, "main")
HELPER = agent(2, "helper")
STARTED_PLANS = [SimpleNamespace(id=plan_id, state=PlanState.STARTED) for plan_id in (3, 5, 8)]
STORED_PLANS = [*STARTED_PLANS, SimpleNamespace(id=9, state=PlanState.APPROVED), SimpleNamespace(id=10, state=PlanState.BLOCKED)]


class StartedPlanRows:
    def __init__(self, plans):
        self.plans = plans

    def query(self, model):
        return self

    def filter(self, **fields):
        return StartedPlanRows([plan for plan in STORED_PLANS if plan.id == fields["id"]]) if "id" in fields else self

    def first(self):
        return self.plans[0] if self.plans else None

    def ordered(self, *columns):
        return self

    def all_rows(self):
        return self.plans


def focus(ready=(), unblocked=(), plans=STARTED_PLANS):
    next_tasks = SimpleNamespace(ready=lambda plan_id, agent: tuple(["a place"]) if (plan_id, agent.id) in ready else ())
    unblockers = SimpleNamespace(plan_unblockers=lambda plan_ids, agent: {
        plan_id: Unblockers(tuple([Unblocker(40, 2, 100)])) if (plan_id, agent.id) in unblocked else Unblockers() for plan_id in plan_ids})
    database = SimpleNamespace(change_mark=lambda: (0, 0), row_owner=None)
    return PlanFocus(StartedPlanRows(plans), SimpleNamespace(), next_tasks, unblockers, database)


def test_the_oldest_started_plan_with_a_ready_task_is_the_default_focus():
    current = focus(ready={(3, 1), (5, 1)}).current(MAIN)
    assert (current.plan.id, current.source) == (3, FocusSource.DEFAULT)


def test_a_plan_with_no_ready_task_and_nothing_to_unblock_is_passed_over():
    assert focus(ready={(8, 1)}).current(MAIN).plan.id == 8


def test_a_plan_with_only_a_task_it_waits_on_that_the_agent_can_take_is_workable():
    assert focus(ready={(8, 1)}, unblocked={(5, 1)}).current(MAIN).plan.id == 5


def test_no_started_plan_or_none_with_work_gives_no_focus():
    assert focus(plans=[]).current(MAIN) is None
    assert focus().current(MAIN) is None


def test_the_default_of_another_agent_skips_the_plans_with_nothing_it_may_take():
    plans = focus(ready={(3, 1), (5, 2)})
    assert (plans.current(MAIN).plan.id, plans.current(HELPER).plan.id) == (3, 5)


def test_the_overview_holds_the_work_of_every_started_plan_and_the_plans_beside_the_focus():
    overview = focus(ready={(5, 1)}).overview(MAIN)
    assert [work.plan.id for work in overview.started] == [3, 5, 8]
    assert (overview.focus_work.plan.id, [work.plan.id for work in overview.remaining]) == (5, [3, 8])


def test_a_started_plan_the_agent_named_is_the_focus_whatever_the_default_would_be():
    current = focus(ready={(3, 1)}).current(agent(1, "main", 8))
    assert (current.plan.id, current.source) == (8, FocusSource.EXPLICIT)


def test_an_approved_plan_the_agent_named_is_the_focus_and_its_work_is_read_with_the_started_plans():
    overview = focus(ready={(3, 1)}).overview(agent(1, "main", 9))
    assert (overview.current.plan.id, [work.plan.id for work in overview.started]) == (9, [3, 5, 8, 9])


def test_a_named_plan_that_is_blocked_or_gone_is_not_used_and_the_default_is_the_focus():
    blocked = focus(ready={(3, 1)}).overview(agent(1, "main", 10))
    deleted = focus(ready={(3, 1)}).overview(agent(1, "main", 77))
    assert (blocked.current.plan.id, blocked.unused.line) == (3, "your focus on plan 10 is not used: the plan is blocked")
    assert (deleted.current.source, deleted.unused.line) == (FocusSource.DEFAULT, "your focus on plan 77 is not used: the plan is gone")
