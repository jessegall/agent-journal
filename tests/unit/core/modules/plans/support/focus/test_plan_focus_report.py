from types import SimpleNamespace

from core.modules.plans.models.enums.focus_source import FocusSource
from core.modules.plans.models.enums.waiting_reason import WaitingReason
from core.modules.plans.support.focus.focus_overview import FocusOverview
from core.modules.plans.support.focus.focused_plan import FocusedPlan
from core.modules.plans.support.focus.plan_focus_report import PlanFocusReport
from core.modules.plans.support.focus.plan_work import PlanWork
from core.modules.plans.support.focus.unblocker import Unblocker
from core.modules.plans.support.focus.unblockers import Unblockers
from core.modules.plans.support.focus.waiting_line import WaitingLine

AGENT = SimpleNamespace(id=1, role="main")
PLANS = [SimpleNamespace(id=plan_id) for plan_id in (3, 5, 8)]
PERSON_WAIT = WaitingLine(40, WaitingReason.NON_TASK_WAIT, "which waits on a person")


def report(focus_plan_id, source=FocusSource.DEFAULT, workable=(), unblockers=None, plans=PLANS):
    plan_unblockers = unblockers or {}
    started = tuple(PlanWork(plan, tuple(["a place"]) if plan.id in workable else (), plan_unblockers.get(plan.id, Unblockers())) for plan in plans)
    current = None if focus_plan_id is None else FocusedPlan(next(plan for plan in plans if plan.id == focus_plan_id), source)
    return PlanFocusReport(SimpleNamespace(overview=lambda agent: FocusOverview(current, started))).lines(AGENT)


def test_the_default_focus_and_a_focus_the_agent_set_read_differently():
    assert report(3, plans=PLANS[:1]) == ["plan 3 is your focus: the default, the oldest started plan with work you can take"]
    assert report(3, FocusSource.EXPLICIT, plans=PLANS[:1]) == ["plan 3 is your focus: you set it"]


def test_the_focus_names_the_tasks_it_waits_on_the_ones_to_take_first_by_how_many_wait_on_them():
    unblockers = {3: Unblockers((Unblocker(41, 1), Unblocker(42, 2)), tuple([PERSON_WAIT]))}
    assert report(3, unblockers=unblockers, plans=PLANS[:1])[1:] == [
        "task 42 holds back 2 tasks of plan 3: you can take it", "task 41 holds back 1 task of plan 3: you can take it", "it waits on task 40, which waits on a person"]


def test_each_other_started_plan_says_whether_it_has_work_what_it_waits_on_or_that_it_has_nothing_to_take():
    lines = report(3, workable={5}, unblockers={8: Unblockers((), tuple([PERSON_WAIT]))})
    assert lines[1:] == ["other started plans:", "plan 5: has work you can take", "plan 8: waits on task 40, which waits on a person"]
    assert report(3, plans=PLANS[:2])[-1] == "plan 5: has no task you can take"


def test_with_no_workable_plan_the_agent_reads_that_it_has_no_focus_and_with_no_started_plan_nothing_more():
    assert report(None, plans=PLANS[:1]) == ["no started plan has work you can take", "other started plans:", "plan 3: has no task you can take"]
    assert report(None, plans=[]) == ["no started plan has work you can take"]
