from core.modules.plans.models.enums.waiting_reason import WaitingReason
from core.modules.plans.support.focus.unblocker import Unblocker
from core.modules.plans.support.focus.unblockers import Unblockers
from core.modules.plans.support.focus.waiting_line import WaitingLine


def waiting(count):
    return tuple(WaitingLine(task_id, WaitingReason.NON_TASK_WAIT, "which waits on a person") for task_id in range(1, count + 1))


def test_one_waiting_task_is_named_with_what_it_waits_on():
    assert Unblockers(waiting=waiting(1)).waits_text() == "task 1, which waits on a person"


def test_five_waiting_tasks_are_all_named_and_of_eight_the_first_five_with_the_number_left_out():
    assert Unblockers(waiting=waiting(5)).waits_text().count("task ") == 5
    assert Unblockers(waiting=waiting(8)).waits_text().endswith("task 5, which waits on a person; and 3 more")


def test_nothing_waiting_gives_no_text_and_the_task_numbers_are_those_of_both_lists():
    unblockers = Unblockers(tuple([Unblocker(7, 2, 100)]), waiting(2))
    assert Unblockers().waits_text() == ""
    assert unblockers.task_ids() == frozenset({1, 2, 7})
