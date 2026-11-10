from dataclasses import replace

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.event_rows import EventRows
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.scopes import Scopes
from core.modules.tasks.commands.start_task.start_task import StartTask
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.dependency_waits import DependencyWaits
from suites.coding.modules.workers.support.assignable_tasks import AssignableTasks
from suites.coding.modules.workers.commands.record_worktree_cut.record_worktree_cut import RecordWorktreeCut
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.worker_task_source import WorkerTaskSource
from core.modules.messages.support.work_sources import WorkSources
from engine.errors.refusal import Refusal
from suites.coding.modules.workers.support.worker_assignments import WorkerAssignments


class RecordWorktreeCutHandler(Handler[RecordWorktreeCut, Worktree]):
    """Moves a worktree's row to cut, delegates the tasks to its worker and starts the first as the worker."""

    command = RecordWorktreeCut

    def __init__(self, rows: EventRows, queries: Queries, repository: Repository, bus: Bus, sources: WorkSources, scopes: Scopes, waits: DependencyWaits, assignments: WorkerAssignments) -> None:
        self.rows, self.queries, self.repository, self.bus = rows, queries, repository, bus
        self.sources, self.scopes = sources, scopes
        self.waits = waits
        self.assignments = assignments

    def handle(self, command: RecordWorktreeCut, context: Context) -> Worktree:
        worktree = self.rows.required(Worktree, command.worktree_id)
        cut = self.repository.save_change(worktree, replace(worktree.cut(context.timestamp, context.actor, command.base_commit, len(command.task_ids)), library_links=command.library_links, library_copies=command.library_copies), context)
        with self.scopes.row_scope(worktree):
            for assigned in command.task_sources:
                if assigned.task_id not in command.task_ids or assigned.source.environment_id != worktree.environment_id:
                    raise Refusal("the task request snapshot belongs to another assignment")
                self.repository.save(WorkerTaskSource(creator_id=context.actor.id, worktree_id=worktree.id, task_id=assigned.task_id,
                                                      source_message_id=assigned.source.message_id,
                                                      source_version=assigned.source.version, source_unavailable=assigned.source.unavailable, started_at=context.timestamp), context)
                self.sources.use_copy(assigned.source, replace(context, environment_id=worktree.environment_id))
        tasks = self.queries.query(Task).find_many(command.task_ids)
        for task in tasks:
            self.repository.update(task, context, delegated_to=worktree.session_agent_id)
        self.waits.update_tasks(command.task_ids, context)
        self.assignments.record(worktree.session_agent_id, tasks, context)
        if AssignableTasks.has_open(list(tasks)):
            self.bus.dispatch(StartTask(command.task_ids[0]), replace(context, actor=Actor(worktree.session_agent_id, ActorType.AGENT)))
        return cut
