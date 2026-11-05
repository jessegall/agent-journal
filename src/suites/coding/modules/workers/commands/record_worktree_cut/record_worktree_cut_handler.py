from dataclasses import replace

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.tasks.commands.start_task.start_task import StartTask
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.record_worktree_cut.record_worktree_cut import RecordWorktreeCut
from suites.coding.modules.workers.models.worktree import Worktree


class RecordWorktreeCutHandler(Handler[RecordWorktreeCut, Worktree]):
    """Moves a worktree's row to cut, delegates the tasks to its worker and starts the first as the worker."""

    command = RecordWorktreeCut

    def __init__(self, rows: EventRows, queries: Queries, repository: Repository, bus: Bus) -> None:
        self.rows, self.queries, self.repository, self.bus = rows, queries, repository, bus

    def handle(self, command: RecordWorktreeCut, context: Context) -> Worktree:
        worktree = self.rows.required(Worktree, command.worktree_id)
        cut = self.repository.save_change(worktree, worktree.cut(context.timestamp, context.actor, command.base_commit), context)
        for task in self.queries.query(Task).find_many(command.task_ids):
            self.repository.update(task, context, delegated_to=worktree.session_agent_id)
        self.bus.dispatch(StartTask(command.task_ids[0]), replace(context, actor=Actor(worktree.session_agent_id, ActorType.AGENT)))
        return cut
