from dataclasses import replace

from engine.actor.actor import Actor
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.event_rows import EventRows
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_dispatcher import AgentDispatcher
from suites.coding.modules.workers.commands.end_gone_worker.end_gone_worker import EndGoneWorker


class EndGoneWorkerHandler(Handler[EndGoneWorker, None]):
    """Has the dispatcher end a worker whose recorded process is no longer running; the dispatcher leaves the row
    open when the launcher still has the worker's program."""

    command = EndGoneWorker

    def __init__(self, rows: EventRows, dispatcher: AgentDispatcher) -> None:
        self.rows, self.dispatcher = rows, dispatcher

    def handle(self, command: EndGoneWorker, context: Context) -> None:
        self.dispatcher.end_lost_process(self.rows.required(Agent, command.agent_id), replace(context, actor=Actor.core()))
