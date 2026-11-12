from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from core.modules.plans.models.enums.checkpoint_state import CheckpointState
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.models.enums.merge_ask_state import MergeAskState
from suites.coding.modules.workers.models.merge_ask import MergeAsk
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.work_unit import WorkUnit
from suites.coding.modules.workers.support.work_units import WorkUnits
from suites.coding.modules.workers.support.worker_steps import WorkerSteps
from suites.coding.modules.workers.support.worktree_runs import WorktreeRuns
from suites.coding.modules.workers.support.merge_ask_part import MergeAskPart
from suites.coding.modules.workers.support.worker_merge_range import WorkerMergeRange

NOTE_HINT = 'journal worker ask-merge "<what it holds, what you changed from the briefs, what you could not check>"'


class MergeAskScope:
    """Checks that a worker may ask for the merge of its unit, whole or up to one task or commit: a unit of more
    tasks, no run of the asked work open or failed, no clash waiting, something committed and no ask waiting
    already; a whole ask also needs nothing started. An ask is never refused for coming early in a plan."""

    def __init__(self, units: WorkUnits, worktrees: WorktreeQuery, tasks: TaskQuery, runs: WorktreeRuns, steps: WorkerSteps, queries: Queries,
                 merge_range: WorkerMergeRange) -> None:
        self.units, self.worktrees, self.tasks, self.runs, self.steps, self.queries = units, worktrees, tasks, runs, steps, queries
        self.range = merge_range

    def checked(self, worker_id: int, note: str, up_to: str) -> MergeAskPart:
        unit = self.units.unit(worker_id)
        worktree = self.worktrees.required_worker_worktree(worker_id)
        if not unit.has_several_tasks:
            raise Refusal("your task asks for its merge by its commit", "run journal worker commit")
        if worktree.commit_count == 0:
            raise Refusal("nothing is committed since your last merge", "commit first")
        started = next(iter(self.tasks.started_tasks(worker_id)), None)
        if started is not None and not up_to:
            raise Refusal(f"task {started.id} is started", "commit it, or ask up to an earlier task with --up-to and go on")
        part = self.part(worktree, unit, up_to)
        self.check_runs(worktree, part.task_ids)
        if self.steps.round(worker_id).conflict is not None:
            raise Refusal(f"your worktree clashed with {worktree.base_branch}", "settle the conflict markers and commit first")
        waiting = self.queries.query(MergeAsk).filter(worktree_id=worktree.id, state=MergeAskState.WAITING).first()
        if waiting is not None:
            raise Refusal(f"your ask {waiting.id} waits for the merge", "wait; you are told when it is merged")
        if not note.strip():
            raise Refusal("say what the merge holds", NOTE_HINT)
        return part

    def part(self, worktree: Worktree, unit: WorkUnit, up_to: str) -> MergeAskPart:
        if not up_to:
            return MergeAskPart(worktree, unit, worktree.commit_short_id, unit.task_ids, True)
        commit = self.range.task_commit(worktree, int(up_to)) if self.range.is_task_number(up_to) else up_to
        if commit is None:
            committed = self.range.tasks_up_to(worktree, worktree.branch)
            last = committed[-1].id if committed else "none yet"
            raise Refusal(f"task {up_to} is not committed in your worktree", f"name a committed task: the last is {last}")
        if not self.range.is_on_branch(worktree, commit):
            raise Refusal(f"commit {up_to} is not on your branch", "journal worker logs lists your commits")
        return MergeAskPart(worktree, unit, commit, tuple(task.id for task in self.range.tasks_up_to(worktree, commit)), False)

    def check_runs(self, worktree: Worktree, task_ids: tuple[int, ...]) -> None:
        blocking = self.runs.blocking_run(worktree.id)
        if blocking is None or not set(blocking[1].tasks()).intersection(task_ids):
            return
        link, reach = blocking
        if reach.state is CheckpointState.RUNNING:
            raise Refusal(f"the tests of checkpoint phase {reach.phase_id} run on your commit {link.commit_id}", "wait: you are woken when they end")
        raise Refusal(f"the tests of checkpoint phase {reach.phase_id} failed on your commit {link.commit_id}", "fix them and commit first")
