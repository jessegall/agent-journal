from types import SimpleNamespace

from core.modules.plans.models.enums.focus_source import FocusSource
from core.modules.plans.support.focus.plan_focus import PlanFocus
from core.modules.plans.support.focus.unblocker import Unblocker
from core.modules.plans.support.focus.unblockers import Unblockers

MAIN = SimpleNamespace(id=1, role="main")
HELPER = SimpleNamespace(id=2, role="helper")
STARTED_PLANS = [SimpleNamespace(id=plan_id) for plan_id in (3, 5, 8)]


class StartedPlanRows:
    def __init__(self, plans):
        self.plans = plans

    def query(self, model):
        return self

    def filter(self, **fields):
        return self

    def ordered(self, *columns):
        return self

    def all_rows(self):
        return self.plans


def focus(ready=(), unblocked=(), plans=STARTED_PLANS):
    next_tasks = SimpleNamespace(ready=lambda plan_id, agent: tuple(["a place"]) if (plan_id, agent.id) in ready else ())
    unblockers = SimpleNamespace(plan_unblockers=lambda plan_ids, agent: {
        plan_id: Unblockers(tuple([Unblocker(40, 2)])) if (plan_id, agent.id) in unblocked else Unblockers() for plan_id in plan_ids})
    return PlanFocus(StartedPlanRows(plans), next_tasks, unblockers)


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
