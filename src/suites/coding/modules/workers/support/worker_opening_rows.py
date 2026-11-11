from dataclasses import replace

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.command.context import Context
from engine.database.database import Database
from engine.listener.rows.event_rows import EventRows
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.agents.models.agent import Agent


class WorkerOpeningRows:
    """Removes a worker that never opened, as the journal itself, or ends it when other rows already refer to it."""

    def __init__(self, rows: EventRows, repository: Repository, database: Database, bus: Bus) -> None:
        self.rows, self.repository, self.database, self.bus = rows, repository, database, bus

    def remove_agent(self, worker_id: int, context: Context) -> None:
        try:
            with self.database.savepoint(type(self).__name__):
                journal_context = replace(context, actor=Actor.core())
                self.repository.delete(self.rows.required(Agent, worker_id), journal_context)
                self.repository.delete(self.rows.required(ActorRecord, worker_id), journal_context)
        except Refusal:
            self.bus.dispatch(EndAgent(worker_id), context)
