from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.base.repository.repository import Repository
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.commands.undo_worker_opening.undo_worker_opening import UndoWorkerOpening
from suites.coding.modules.workers.models.worktree import Worktree


class UndoWorkerOpeningHandler(Handler[UndoWorkerOpening, None]):
    """Deletes the worktree row of a dispatch that never got cut, then its worker's agent row and actor."""

    command = UndoWorkerOpening

    def __init__(self, rows: EventRows, repository: Repository) -> None:
        self.rows, self.repository = rows, repository

    def handle(self, command: UndoWorkerOpening, context: Context) -> None:
        worktree = self.rows.required(Worktree, command.worktree_id)
        self.repository.delete(worktree, context)
        self.repository.delete(self.rows.required(Agent, worktree.session_agent_id), context)
        self.repository.delete(self.rows.required(ActorRecord, worktree.session_agent_id), context)
