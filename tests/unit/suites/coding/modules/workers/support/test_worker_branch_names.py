from suites.coding.modules.workers.support.worker_branch_names import WorkerBranchNames

NAMES = WorkerBranchNames("journal/main/worker-5")


def test_the_first_worktree_of_a_worker_has_the_workers_own_branch_name():
    assert NAMES.branch(1) == "journal/main/worker-5"


def test_the_second_and_third_worktree_carry_their_position():
    assert [NAMES.branch(2), NAMES.branch(3)] == ["journal/main/worker-5-2", "journal/main/worker-5-3"]
