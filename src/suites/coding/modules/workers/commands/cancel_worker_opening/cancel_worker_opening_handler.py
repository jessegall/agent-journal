from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.base.repository.repository import Repository
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.commands.cancel_worker_opening.cancel_worker_opening import CancelWorkerOpening
from suites.coding.modules.workers.models.worktree import Worktree


class CancelWorkerOpeningHandler(Handler[CancelWorkerOpening, None]):
    """Deletes the worktree row of a dispatch that never got cut, then its worker's agent row and actor."""

    command = CancelWorkerOpening

    def __init__(self, rows: EventRows, repository: Repository) -> None:
        self.rows, self.repository = rows, repository

    def handle(self, command: CancelWorkerOpening, context: Context) -> None:
        worktree = self.rows.required(Worktree, command.worktree_id)
        self.repository.delete(worktree, context)
        self.repository.delete(self.rows.required(Agent, worktree.session_agent_id), context)
        self.repository.delete(self.rows.required(ActorRecord, worktree.session_agent_id), context)
