from dataclasses import replace

from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.agents.commands.record_agent_process.record_agent_process import RecordAgentProcess
from suites.coding.modules.workers.commands.end_gone_worker.end_gone_worker import EndGoneWorker


class EndGoneWorkerHandler(Handler[EndGoneWorker, None]):
    """The journal ends a worker whose process is gone, as itself and not as the main agent whose tick noticed, so
    the worker is told to carry on rather than counted as stopped on purpose, and its process is forgotten, since
    nothing is left of it to stop before a resume."""

    command = EndGoneWorker

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, command: EndGoneWorker, context: Context) -> None:
        core = replace(context, actor=Actor.core())
        self.bus.dispatch(RecordAgentProcess(command.agent_id, None), core)
        self.bus.dispatch(EndAgent(command.agent_id), core)
