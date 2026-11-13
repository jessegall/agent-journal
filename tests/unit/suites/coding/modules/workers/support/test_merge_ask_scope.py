from dataclasses import dataclass, replace

import pytest

from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.models.enums.checkpoint_state import CheckpointState
from engine.errors.refusal import Refusal
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.worktree_reach import WorktreeReach
from suites.coding.modules.workers.support.merge_ask_part import MergeAskPart
from suites.coding.modules.workers.support.merge_ask_scope import MergeAskScope
from suites.coding.modules.workers.support.worker_merge_range import WorkerMergeRange
from suites.coding.modules.workers.support.work_unit import WorkUnit

WORKTREE = Worktree(id=5, session_agent_id=1, task_id=7, creator_id=1, folder="/w", branch="worker", base_branch="version-5", commit_count=2, commit_short_id="c0ffee1")
LIST_UNIT = WorkUnit(None, None, (7, 8), 0, 2, 0)


@dataclass
class SampleTask:
    id: int


class SampleUnits:
    def __init__(self, unit):
        self.value = unit

    def unit(self, worker_id):
        return self.value


class SampleWorktrees:
    def __init__(self, worktree):
        self.worktree = worktree

    def required_worker_worktree(self, worker_id):
        return self.worktree


class SampleTasks:
    def __init__(self, *started):
        self.started = started

    def started_tasks(self, worker_id):
        return self.started


class SampleRuns:
    def __init__(self, blocking=None):
        self.blocking = blocking

    def blocking_run(self, worktree_id):
        return self.blocking


@dataclass
class SampleRound:
    conflict: object = None


class SampleSteps:
    def __init__(self, conflict=None):
        self.conflict = conflict

    def round(self, worker_id):
        return SampleRound(self.conflict)


class SampleQuery:
    def __init__(self, waiting):
        self.waiting = waiting

    def filter(self, **values):
        return self

    def first(self):
        return self.waiting


class SampleQueries:
    def __init__(self, waiting=None):
        self.waiting = waiting

    def query(self, model):
        return SampleQuery(self.waiting)


class SampleRange(WorkerMergeRange):
    def __init__(self):
        self.commits = {7: "a1", 8: "b2"}

    def task_commit(self, worktree, task_id):
        return self.commits.get(task_id)

    def is_branch_commit(self, worktree, commit):
        return commit in self.commits.values()

    def leading_tasks(self, worktree, commit):
        return [SampleTask(task_id) for task_id, task_commit in self.commits.items() if task_id <= {"a1": 7, "b2": 8}.get(commit, 8)]


def scope(unit=LIST_UNIT, worktree=WORKTREE, started=(), blocking=None, conflict=None, waiting=None) -> MergeAskScope:
    return MergeAskScope(SampleUnits(unit), SampleWorktrees(worktree), SampleTasks(*started), SampleRuns(blocking), SampleSteps(conflict), SampleQueries(waiting), SampleRange())


def run(state: CheckpointState) -> tuple[WorktreeReach, CheckpointReach]:
    reach = replace(CheckpointReach.agent_commit_start(1, 2, 3, (7, 8)), id=4, state=state)
    return WorktreeReach(reach_id=4, worktree_id=5, phase_id=3, commit_id="9b1e0d2"), reach


def refusal_of(checked_scope: MergeAskScope, note: str = "the cart", up_to: str = "") -> str:
    with pytest.raises(Refusal) as refused:
        checked_scope.checked(1, note, up_to)
    return str(refused.value)


def test_a_unit_of_one_asks_by_its_commit():
    assert "your task asks for its merge by its commit" in refusal_of(scope(unit=WorkUnit(None, None, tuple([7]), 0, 1, 0)))


def test_a_started_task_is_refused():
    assert "task 8 is started" in refusal_of(scope(started=tuple([SampleTask(8)])))


def test_a_run_that_goes_is_refused():
    assert "the tests of checkpoint phase 3 run on your commit 9b1e0d2" in refusal_of(scope(blocking=run(CheckpointState.RUNNING)))


def test_a_run_that_failed_is_refused():
    assert "the tests of checkpoint phase 3 failed on your commit 9b1e0d2" in refusal_of(scope(blocking=run(CheckpointState.FAILED)))


def test_a_clash_that_waits_is_refused():
    assert "your worktree clashed with version-5" in refusal_of(scope(conflict=object()))


def test_nothing_committed_is_refused():
    assert "nothing is committed since your last merge" in refusal_of(scope(worktree=replace(WORKTREE, commit_count=0)))


def test_an_ask_that_waits_is_refused():
    assert "your ask 9 waits for the merge" in refusal_of(scope(waiting=SampleTask(9)))


def test_an_empty_note_is_refused():
    assert "write what the merge contains" in refusal_of(scope(), note=" ")


def test_a_whole_ask_is_accepted_after_phase_1_of_9():
    assert scope().checked(1, "phase 1 of 9 is done", "") == MergeAskPart(WORKTREE, LIST_UNIT, "c0ffee1", (7, 8), True)


def test_any_note_length_is_accepted():
    assert scope().checked(1, "x" * 5000, "").unit == LIST_UNIT


def test_an_ask_up_to_a_task_carries_every_earlier_commit():
    part = scope(started=tuple([SampleTask(9)])).checked(1, "the first part", "7")
    assert (part.commit_id, part.task_ids, part.is_full) == ("a1", tuple([7]), False)


def test_an_ask_up_to_an_uncommitted_task_is_refused():
    assert "task 9 is not committed in your worktree" in refusal_of(scope(), up_to="9")


def test_an_ask_up_to_a_commit_off_the_branch_is_refused():
    assert "commit ffff123 is not on your branch" in refusal_of(scope(), up_to="ffff123")


def test_an_ask_over_a_part_whose_run_is_open_is_refused():
    assert "run on your commit" in refusal_of(scope(blocking=run(CheckpointState.RUNNING)), up_to="7")
