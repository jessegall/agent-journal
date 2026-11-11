from dataclasses import replace

from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.event_rows import EventRows
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from engine.driver.nudger import Nudger
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.record_worktree_merge.record_worktree_merge import RecordWorktreeMerge
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.checkpoint_wait_text import CheckpointWaitText
from suites.coding.modules.workers.support.merge_outcome import MergeOutcome
from suites.coding.modules.workers.support.worker_job import MERGE_CONFLICT_SOURCE
from suites.coding.modules.workers.support.worker_nudges import WORKER_MERGE_CONFLICT
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.worker_task_advance import WorkerTaskAdvance


class RecordWorktreeMergeHandler(Handler[RecordWorktreeMerge, MergeOutcome]):
    """Closes the worker's delivered tasks once git has merged its worktree, or restarts its task with the files
    that clashed. A task of a started plan is closed with the checkpoint its tests run at."""

    command = RecordWorktreeMerge
    runs_once = True
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, rows: EventRows, repository: Repository, nudger: Nudger, advance: WorkerTaskAdvance, guidance: WorkerGuidance, wait_text: CheckpointWaitText) -> None:
        self.wait_text = wait_text
        self.queries, self.rows, self.repository, self.nudger, self.advance, self.guidance = queries, rows, repository, nudger, advance, guidance

    def handle(self, command: RecordWorktreeMerge, context: Context) -> MergeOutcome:
        worktree = self.rows.required(Worktree, command.worktree_id)
        task = self.rows.required(Task, worktree.task_id)
        if command.conflicts:
            return MergeOutcome(self.returned(worktree, task, command.conflicts, context), command.conflicts)
        delivered_tasks = self.delivered_tasks(worktree, task)
        reasons = self.wait_text.merged_reasons(worktree, [delivered.id for delivered in delivered_tasks])
        for delivered in delivered_tasks:
            self.repository.save_change(delivered, delivered.close(context.timestamp, context.actor, reasons[delivered.id]), context)
        merged = replace(worktree.merge(context.timestamp, context.actor), commit_before_merge=command.commit_before_merge, commit_after_merge=command.commit_after_merge,
                         merged_task_ids=",".join(str(delivered.id) for delivered in delivered_tasks))
        return MergeOutcome(self.repository.save_change(worktree, merged, context), ())

    def delivered_tasks(self, worktree: Worktree, task: Task) -> list[Task]:
        delivered = tuple(self.queries.query(Task).filter(delegated_to=worktree.session_agent_id, state=TaskState.TESTING).all_rows())
        return [row for row in (task, *delivered) if row.state is TaskState.TESTING and (row is task or row.id != task.id)]

    def returned(self, worktree: Worktree, task: Task, conflicts: tuple[str, ...], context: Context) -> Worktree:
        self.advance.restart_task(worktree, task, context)
        files = ", ".join(conflicts)
        self.nudger.send(worktree.session_agent_id, WORKER_MERGE_CONFLICT, MERGE_CONFLICT_SOURCE, context, branch=worktree.base_branch, lines=files, line=self.guidance.conflict_line(task, files))
        return self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.rework), context)
