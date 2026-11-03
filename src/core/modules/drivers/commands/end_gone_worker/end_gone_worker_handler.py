from dataclasses import replace

from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.drivers.commands.end_gone_worker.end_gone_worker import EndGoneWorker


class EndGoneWorkerHandler(Handler[EndGoneWorker, None]):
    """The journal ends a worker whose process is gone, as itself and not as the main agent whose tick noticed, so
    the worker is told to carry on rather than counted as stopped on purpose."""

    command = EndGoneWorker

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, command: EndGoneWorker, context: Context) -> None:
        self.bus.dispatch(EndAgent(command.agent_id), replace(context, actor=Actor.core()))
