from dataclasses import replace

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.agents.commands.record_agent_process.record_agent_process import RecordAgentProcess
from suites.coding.modules.workers.commands.end_gone_worker.end_gone_worker import EndGoneWorker


class EndGoneWorkerHandler(Handler[EndGoneWorker, None]):
    """End a worker whose recorded process is no longer running."""

    command = EndGoneWorker

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, command: EndGoneWorker, context: Context) -> None:
        core = replace(context, actor=Actor.core())
        self.bus.dispatch(RecordAgentProcess(command.agent_id, None), core)
        self.bus.dispatch(EndAgent(command.agent_id), core)
