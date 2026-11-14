from suites.coding.modules.workers.support.work_unit import WorkUnit


def test_a_single_task_with_no_plan_is_a_unit_of_one():
    assert WorkUnit(None, None, tuple([7]), 1, 1, 1).is_single


def test_three_tasks_are_no_unit_of_one():
    assert not WorkUnit(None, None, (7, 8, 9), 3, 3, 3).is_single


def test_a_unit_is_committed_once_no_task_is_left_uncommitted():
    assert (WorkUnit(None, None, (7, 8), 0, 2, 0).is_committed, WorkUnit(None, None, (7, 8), 1, 2, 1).is_committed) == (True, False)


def test_a_unit_with_no_task_is_not_committed():
    assert not WorkUnit(None, None, (), 0, 0, 0).is_committed


def test_the_unit_line_of_tasks_sent_together_counts_the_committed_ones():
    assert WorkUnit(None, None, (8901, 8902, 8903), 2, 3, 2).status_line == "Unit: tasks 8901, 8902, 8903, sent to you together. 1 of 3 committed."


def test_a_unit_of_one_has_no_unit_line():
    assert WorkUnit(None, None, tuple([8901]), 1, 1, 1).status_line == ""


def test_the_brief_of_a_list_names_the_tasks_sent_together():
    assert WorkUnit(None, None, (8901, 8902, 8903), 3, 3, 3).name_line == "Your unit is tasks 8901, 8902 and 8903, sent to you together. Work all of them before you report."


def test_the_brief_of_one_task_names_no_unit():
    assert WorkUnit(None, None, tuple([8901]), 1, 1, 1).name_line == ""
