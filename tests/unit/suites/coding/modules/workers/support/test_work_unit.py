from suites.coding.modules.workers.support.work_unit import WorkUnit


def test_a_single_task_with_no_plan_is_a_unit_of_one():
    assert WorkUnit(None, None, (7,), 1).is_single


def test_three_tasks_are_no_unit_of_one():
    assert not WorkUnit(None, None, (7, 8, 9), 3).is_single


def test_a_unit_is_committed_once_no_task_is_left_uncommitted():
    assert (WorkUnit(None, None, (7, 8), 0).is_committed, WorkUnit(None, None, (7, 8), 1).is_committed) == (True, False)


def test_a_unit_with_no_task_is_not_committed():
    assert not WorkUnit(None, None, (), 0).is_committed
