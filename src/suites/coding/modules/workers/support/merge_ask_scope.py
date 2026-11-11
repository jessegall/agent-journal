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

NOTE_HINT = 'journal worker ask-merge "<what it holds, what you changed from the briefs, what you could not check>"'


class MergeAskScope:
    """Checks that a worker may ask for the merge of its whole unit: a unit of more tasks, nothing started,
    every run of its commits passed, no clash waiting, something committed and no ask waiting already. An ask
    is never refused for coming early in a plan."""

    def __init__(self, units: WorkUnits, worktrees: WorktreeQuery, tasks: TaskQuery, runs: WorktreeRuns, steps: WorkerSteps, queries: Queries) -> None:
        self.units, self.worktrees, self.tasks, self.runs, self.steps, self.queries = units, worktrees, tasks, runs, steps, queries

    def checked(self, worker_id: int, note: str) -> tuple[Worktree, WorkUnit]:
        unit = self.units.unit(worker_id)
        worktree = self.worktrees.required_worker_worktree(worker_id)
        if not unit.has_several_tasks:
            raise Refusal("your task asks for its merge by its commit", "run journal worker commit")
        started = next(iter(self.tasks.started_tasks(worker_id)), None)
        if started is not None:
            raise Refusal(f"task {started.id} is started", "commit it first")
        self.check_runs(worktree)
        if self.steps.round(worker_id).conflict is not None:
            raise Refusal(f"your worktree clashed with {worktree.base_branch}", "settle the conflict markers and commit first")
        if worktree.commit_count == 0:
            raise Refusal("nothing is committed since your last merge", "commit first")
        waiting = self.queries.query(MergeAsk).filter(worktree_id=worktree.id, state=MergeAskState.WAITING).first()
        if waiting is not None:
            raise Refusal(f"your ask {waiting.id} waits for the merge", "wait; you are told when it is merged")
        if not note.strip():
            raise Refusal("say what the merge holds", NOTE_HINT)
        return worktree, unit

    def check_runs(self, worktree: Worktree) -> None:
        blocking = self.runs.blocking_run(worktree.id)
        if blocking is None:
            return
        link, reach = blocking
        if reach.state is CheckpointState.RUNNING:
            raise Refusal(f"the tests of checkpoint phase {reach.phase_id} run on your commit {link.commit_id}", "wait: you are woken when they end")
        raise Refusal(f"the tests of checkpoint phase {reach.phase_id} failed on your commit {link.commit_id}", "fix them and commit first")
