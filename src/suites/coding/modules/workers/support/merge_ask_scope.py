from engine.errors.refusal import Refusal
from core.modules.plans.models.enums.checkpoint_state import CheckpointState
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.support.merged_asks import MergedAsks
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.work_unit import WorkUnit
from suites.coding.modules.workers.support.work_units import WorkUnits
from suites.coding.modules.workers.support.worktree_runs import WorktreeRuns
from suites.coding.modules.workers.support.merge_ask_part import MergeAskPart
from suites.coding.modules.workers.support.worker_merge_range import WorkerMergeRange

NOTE_HINT = 'journal worker ask-merge "<what it holds, what you changed from the briefs, what you could not check>"'


class MergeAskScope:
    """Checks that a worker may ask for the merge of its unit, whole or up to one task or commit: a unit of more
    tasks, no run of the asked work open or failed, no clash waiting, something committed and no ask waiting
    whose work is not on the base branch yet; a whole ask also needs nothing started. An ask is never refused for coming early in a plan."""

    def __init__(self, units: WorkUnits, worktrees: WorktreeQuery, tasks: TaskQuery, runs: WorktreeRuns, merged_asks: MergedAsks,
                 merge_range: WorkerMergeRange) -> None:
        self.units, self.worktrees, self.tasks, self.runs, self.merged_asks = units, worktrees, tasks, runs, merged_asks
        self.range = merge_range

    def checked(self, worker_id: int, note: str, last_task: str) -> MergeAskPart:
        unit = self.units.unit(worker_id)
        worktree = self.worktrees.required_worker_worktree(worker_id)
        if not unit.has_several_tasks:
            raise Refusal("your task asks for its merge by its commit", "run journal worker commit")
        if worktree.commit_count == 0:
            raise Refusal("nothing is committed since your last merge", "commit first")
        started = next(iter(self.tasks.started_tasks(worker_id)), None)
        if started is not None and not last_task:
            raise Refusal(f"task {started.id} is started", "commit it, or ask up to an earlier task with --up-to and go on")
        self.range.require_committed_merge(worktree)
        part = self.part(worktree, unit, last_task)
        self.check_base(worktree, part)
        self.check_runs(worktree, part.task_ids)
        waiting = self.merged_asks.waiting(worktree)
        if waiting is not None:
            raise Refusal(f"your ask {waiting.id} waits for the merge", "wait; you are informed when it is merged")
        if not note.strip():
            raise Refusal("write what the merge contains", NOTE_HINT)
        return part

    def part(self, worktree: Worktree, unit: WorkUnit, last_task: str) -> MergeAskPart:
        if not last_task:
            return MergeAskPart(worktree, unit, self.range.branch_tip(worktree), unit.task_ids, True)
        commit = self.range.task_commit(worktree, int(last_task)) if self.range.is_task_number(last_task) else last_task
        if commit is None:
            committed = self.range.leading_tasks(worktree, worktree.branch)
            last = committed[-1].id if committed else "none yet"
            raise Refusal(f"task {last_task} is not committed in your worktree", f"name a committed task: the last is {last}")
        if not self.range.is_branch_commit(worktree, commit):
            raise Refusal(f"commit {last_task} is not on your branch", "journal worker logs lists your commits")
        return MergeAskPart(worktree, unit, commit, tuple(task.id for task in self.range.leading_tasks(worktree, commit)), False)

    # the base branch changed none of the files the asked work changed, so its checkpoint tests ran on the code the
    # merge makes for those files; a base that moves on elsewhere never holds the ask up
    def check_base(self, worktree: Worktree, part: MergeAskPart) -> None:
        shared = self.range.worktree_file_base_changes(worktree, part.commit_id)
        if not shared:
            return
        raise Refusal(f"{worktree.base_branch} changed {len(shared)} of the files your work changed, such as {shared[0]}", "run journal worker update and ask again: the ask takes the update with it")

    def check_runs(self, worktree: Worktree, task_ids: tuple[int, ...]) -> None:
        blocking = self.runs.blocking_run(worktree.id)
        if blocking is None or not set(blocking[1].tasks()).intersection(task_ids):
            return
        link, reach = blocking
        if reach.state is CheckpointState.RUNNING:
            raise Refusal(f"the tests of checkpoint phase {reach.phase_id} run on your commit {link.commit_id}", "wait: you are woken when they end")
        raise Refusal(f"the tests of checkpoint phase {reach.phase_id} failed on your commit {link.commit_id}", "fix them and commit first")
