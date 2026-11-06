from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.database.database import Database
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.commands.cancel_worker_opening.cancel_worker_opening import CancelWorkerOpening
from suites.coding.modules.workers.models.worktree import Worktree


class CancelWorkerOpeningHandler(Handler[CancelWorkerOpening, None]):
    """Deletes the worktree row of a dispatch that never got cut, then its worker's agent row and actor; a worker
    other rows already refer to stays in the record, ended, so a failed dispatch never holds a worker's place."""

    command = CancelWorkerOpening
    runs_once = True

    def __init__(self, rows: EventRows, repository: Repository, database: Database, bus: Bus) -> None:
        self.rows, self.repository, self.database, self.bus = rows, repository, database, bus

    def handle(self, command: CancelWorkerOpening, context: Context) -> None:
        worktree = self.rows.required(Worktree, command.worktree_id)
        self.repository.delete(worktree, context)
        if command.keeps_agent:
            return
        try:
            with self.database.savepoint(type(command).__name__):
                self.repository.delete(self.rows.required(Agent, worktree.session_agent_id), context)
                self.repository.delete(self.rows.required(ActorRecord, worktree.session_agent_id), context)
        except Refusal:
            self.bus.dispatch(EndAgent(worktree.session_agent_id), context)
