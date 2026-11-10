from types import SimpleNamespace

from core.modules.plans.models.enums.waiting_reason import WaitingReason
from core.modules.plans.support.focus.plan_wait_walk import PlanWaitWalk
from core.modules.plans.support.focus.wait_graph import LONGEST_CHAIN, WaitGraph
from core.modules.plans.support.focus.waiting_line import WaitingLine


def test_two_plan_tasks_that_wait_on_one_task_and_one_that_waits_through_a_chain_are_counted_on_the_ends():
    walk = PlanWaitWalk.walked([1, 2, 3], WaitGraph({1: [7], 2: [7], 3: [8], 8: [9]}))
    assert walk.waiting_tasks == {7: {1, 2}, 9: {3}}


def test_a_circle_gives_a_line_and_no_end_and_a_chain_too_long_gives_a_line():
    chain = {number: [number + 1] for number in range(20, 21 + LONGEST_CHAIN)}
    walk = PlanWaitWalk.walked([1, 2], WaitGraph({1: [7], 7: [8], 8: [7], 2: [20], **chain}))
    assert not walk.waiting_tasks
    assert {task_id: line.reason for task_id, line in walk.chain_lines.items()} == {7: WaitingReason.CIRCLE, 20: WaitingReason.LONG_CHAIN}


def test_an_end_the_agent_can_take_is_a_candidate_with_its_count_and_any_other_end_is_a_line():
    walk = PlanWaitWalk.walked([1, 2, 3], WaitGraph({1: [7], 2: [7], 3: [9]}))
    person_wait = WaitingLine(9, WaitingReason.NON_TASK_WAIT, "which waits on a person")
    facts = SimpleNamespace(waiting_line=lambda task: person_wait if task.id == 9 else None)
    unblockers = walk.unblockers({7: SimpleNamespace(id=7), 9: SimpleNamespace(id=9)}, facts)
    assert [(candidate.task_id, candidate.unlocks) for candidate in unblockers.candidates] == [(7, 2)]
    assert unblockers.waiting == tuple([person_wait])
