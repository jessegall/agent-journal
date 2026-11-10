from types import SimpleNamespace

import pytest

from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.enums.waiting_reason import WaitingReason
from core.modules.plans.support.focus.unblocker_facts import UnblockerFacts
from core.modules.tasks.models.enums.task_state import TaskState

MAIN = SimpleNamespace(id=1, role="main", number=1)
LATER_MAIN = SimpleNamespace(id=9, role="main", number=1)
WORKER = SimpleNamespace(id=2, role="worker", number=2)
AGENTS = {agent.id: agent for agent in (MAIN, LATER_MAIN, WORKER)}


def task(task_id=7, state=TaskState.OPEN, holder_id=None, assignee_id=None):
    return SimpleNamespace(id=task_id, state=state, holder_id=holder_id, delegated_to=assignee_id)


def place(task_id, plan_id, phase_id, phase_position, state=TaskState.OPEN, checkpoint=False, closed_at=None):
    return SimpleNamespace(task_id=task_id, plan_id=plan_id, phase_id=phase_id, phase_position=phase_position, state=state, checkpoint=checkpoint, closed_at=closed_at)


def facts(asker=MAIN, takeable_ids=tuple([7]), places=(), plan_state=PlanState.STARTED, waits=()):
    rows = list(places)
    return UnblockerFacts(asker, frozenset(takeable_ids), {row.task_id: row for row in rows if row.task_id == 7},
                          {4: SimpleNamespace(id=4, state=plan_state)}, {4: rows}, {7: list(waits)}, AGENTS)


def test_an_open_task_in_no_plan_that_the_asker_may_take_can_be_handed_out():
    assert facts().waiting_line(task()) is None


@pytest.mark.parametrize("started_task, asker, reason, text", [
    (task(state=TaskState.STARTED, holder_id=2), MAIN, WaitingReason.ANOTHER_HOLDER, "which worker 2 holds"),
    (task(state=TaskState.STARTED, holder_id=1), MAIN, WaitingReason.ASKER_HOLDER, "which you hold"),
    (task(state=TaskState.TESTING, holder_id=9), MAIN, WaitingReason.ASKER_HOLDER, "which you hold"),
    (task(state=TaskState.STARTED, holder_id=1), WORKER, WaitingReason.ANOTHER_HOLDER, "which main agent holds"),
])
def test_a_started_task_names_its_holder_and_every_main_agent_is_the_same_holder(started_task, asker, reason, text):
    line = facts(asker).waiting_line(started_task)
    assert (line.reason, line.text) == (reason, text)


@pytest.mark.parametrize("waits, text", [
    ([SimpleNamespace(target="user", command="")], "which waits on a person"),
    ([SimpleNamespace(target="", command="test -f x")], "which waits on a command"),
    ([SimpleNamespace(target="plans:3", command="")], "which waits on something that is no task"),
    ([], "which is blocked with a reason"),
])
def test_a_blocked_task_at_the_end_of_the_waits_says_what_it_waits_on(waits, text):
    line = facts(waits=waits).waiting_line(task(state=TaskState.BLOCKED))
    assert (line.reason, line.text) == (WaitingReason.NON_TASK_WAIT, text)


def test_a_task_the_asker_may_not_take_names_who_it_is_reserved_for():
    reserved = facts(takeable_ids=()).waiting_line(task(assignee_id=2))
    free = facts(WORKER, takeable_ids=()).waiting_line(task())
    assert (reserved.reason, reserved.text) == (WaitingReason.ANOTHER_ASSIGNEE, "which is reserved for worker 2")
    assert (free.reason, free.text) == (WaitingReason.ANOTHER_ASSIGNEE, "which is not assigned to you")


@pytest.mark.parametrize("state, text", [
    (PlanState.DRAFT, "which is in plan 4, a plan nobody approved"),
    (PlanState.READY, "which is in plan 4, a plan nobody approved"),
    (PlanState.BLOCKED, "which is in plan 4, a plan that is blocked"),
])
def test_a_task_of_a_plan_that_is_not_followed_names_the_plan(state, text):
    line = facts(places=[place(7, 4, 11, 1)], plan_state=state).waiting_line(task())
    assert (line.reason, line.text) == (WaitingReason.UNAPPROVED_PLAN, text)


def test_a_task_behind_an_open_checkpoint_phase_names_that_phase_and_a_closed_checkpoint_holds_nothing():
    behind = facts(places=[place(6, 4, 11, 1, checkpoint=True), place(7, 4, 12, 2)]).waiting_line(task())
    passed = facts(places=[place(6, 4, 11, 1, state=TaskState.COMPLETED, checkpoint=True, closed_at="2026"), place(7, 4, 12, 2)]).waiting_line(task())
    assert (behind.reason, behind.text) == (WaitingReason.CHECKPOINT, "which is behind the checkpoint phase 11 of plan 4")
    assert passed is None


def test_a_task_in_a_later_phase_than_the_working_phase_of_its_plan_is_not_handed_out():
    line = facts(places=[place(6, 4, 11, 1), place(7, 4, 12, 2)]).waiting_line(task())
    assert (line.reason, line.text) == (WaitingReason.LATER_PHASE, "which is in a later phase of plan 4")
    assert facts(places=[place(7, 4, 12, 2)]).waiting_line(task()) is None
