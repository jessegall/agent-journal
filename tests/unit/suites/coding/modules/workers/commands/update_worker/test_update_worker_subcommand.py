from suites.coding.modules.workers.models.enums.update_result import UpdateResult
from suites.coding.modules.workers.models.enums.worker_operation_name import WorkerOperationName
from suites.coding.modules.workers.models.worktree_update import WorktreeUpdate
from suites.coding.modules.workers.support.update_outcome import UpdateOutcome


def test_the_worker_update_command_is_queued_as_an_update_operation():
    assert WorkerOperationName("update") is WorkerOperationName.UPDATE and not WorkerOperationName.UPDATE.is_handoff


def test_a_clean_update_names_the_base_and_its_short_id():
    outcome = UpdateOutcome("version-5", WorktreeUpdate("0123456789abcdef"), UpdateResult.UPDATED)
    assert outcome.lines() == ["Your worktree is on version-5 at 0123456789. Go on."]


def test_a_twin_update_says_already_up_to_date():
    outcome = UpdateOutcome("version-5", WorktreeUpdate.current("0123456789abcdef"), UpdateResult.CURRENT)
    assert outcome.lines() == ["already up to date with version-5"]


def test_a_clash_names_its_files_and_the_stash_the_next_commit_puts_back():
    outcome = UpdateOutcome("version-5", WorktreeUpdate("0123456789", ("cart.py", "tax.py"), "s1"), UpdateResult.CONFLICTS)
    assert outcome.lines() == ["The update clashes with version-5 in cart.py, tax.py: settle the markers, then go on. Your next commit carries the settled files.",
                               "Your uncommitted changes stay in stash s1 until your next commit puts them back on the settled merge."]
