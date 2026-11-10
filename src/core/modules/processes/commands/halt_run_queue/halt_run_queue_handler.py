from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.errors.refusal import Refusal
from core.modules.processes.commands.halt_run_queue.halt_run_queue import HaltRunQueue
from core.modules.processes.support.run_queue_halt import RunQueueHalt


class HaltRunQueueHandler(Handler[HaltRunQueue, str]):
    """Halts the run queue with the reason it is halted for."""

    command = HaltRunQueue

    def __init__(self, halt: RunQueueHalt) -> None:
        self.halt = halt

    def handle(self, command: HaltRunQueue, context: Context) -> str:
        if not command.reason.strip():
            raise Refusal("say why the queue is halted", "journal queue halt \"<why>\"")
        self.halt.halt(command.reason.strip())
        return f"the process queue is halted: {command.reason.strip()}"
