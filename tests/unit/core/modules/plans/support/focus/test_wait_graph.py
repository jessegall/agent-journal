from core.modules.plans.support.focus.wait_graph import LONGEST_CHAIN, WaitGraph


def test_a_task_that_waits_on_nothing_is_its_own_end():
    assert WaitGraph({}).ends(7).task_ids == {7}


def test_a_chain_of_three_ends_at_the_last_task_and_two_branches_end_at_both():
    graph = WaitGraph({1: [2], 2: [3], 4: [3, 5]})
    assert graph.ends(1).task_ids == {3}
    assert graph.ends(4).task_ids == {3, 5}


def test_a_circle_of_waits_stops_the_walk_and_says_so():
    ends = WaitGraph({1: [2], 2: [3], 3: [1]}).ends(1)
    assert ends.has_circle and not ends.task_ids


def test_a_chain_longer_than_the_limit_has_long_chain_and_one_at_the_limit_is_followed():
    waits = {number: [number + 1] for number in range(1, LONGEST_CHAIN + 2)}
    assert WaitGraph(waits).ends(1).has_long_chain
    assert WaitGraph(waits).ends(3).task_ids == {LONGEST_CHAIN + 2}
