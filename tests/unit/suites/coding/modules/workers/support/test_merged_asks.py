from types import SimpleNamespace

from suites.coding.modules.workers.support.merged_asks import MergedAsks

WORKTREE = SimpleNamespace(id=4, folder="/worktrees/worker-7", base_branch="version-6")
ASK = SimpleNamespace(id=29, commit_id="0e8351e6e8")


class SampleGit:
    """Says whether a commit is on a branch, as git merge-base --is-ancestor does."""

    def __init__(self, merged: bool) -> None:
        self.merged = merged

    def is_ancestor(self, folder, ancestor, commit):
        return self.merged


class SampleMergedAsks(MergedAsks):
    def waiting_asks(self, worktree):
        return [ASK]


def test_an_ask_whose_work_reached_the_base_branch_another_way_no_longer_waits():
    assert SampleMergedAsks(None, None, SampleGit(merged=True)).waiting(WORKTREE) is None


def test_an_ask_whose_work_is_not_on_the_base_branch_still_waits():
    assert SampleMergedAsks(None, None, SampleGit(merged=False)).waiting(WORKTREE) is ASK
