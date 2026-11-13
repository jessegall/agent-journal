from suites.coding.modules.workers.support.merge_return_text import merge_return_line
from suites.coding.modules.workers.support.work_unit import WorkUnit


def test_the_return_line_of_a_unit_of_more():
    line = merge_return_line("the judge found two sins", WorkUnit(None, None, (7, 8), 0, 2, 0))
    assert line == ("Your merge was sent back: the judge found two sins. Your worktree is open again. "
                    "Now: fix it, commit, and ask for the merge again with journal worker ask-merge.")


def test_the_return_line_of_a_unit_of_one():
    line = merge_return_line("the judge found two sins", WorkUnit(None, None, tuple([7]), 0, 1, 0))
    assert line == "Your merge was sent back: the judge found two sins. Fix it in your worktree and commit again."
