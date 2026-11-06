from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.modules.processes.commands.resume_run_queue.resume_run_queue import ResumeRunQueue
from core.modules.processes.support.run_queue_halt import RunQueueHalt
from core.modules.processes.support.run_slots import RunSlots


class ResumeRunQueueHandler(Handler[ResumeRunQueue, str]):
    """Removes the halt a command put on the run queue and grants the slots that are free."""

    command = ResumeRunQueue
    runs_once = True

    def __init__(self, halt: RunQueueHalt, slots: RunSlots) -> None:
        self.halt, self.slots = halt, slots

    def handle(self, command: ResumeRunQueue, context: Context) -> str:
        if not self.halt.command_halted:
            raise Refusal("the process queue is not halted", "journal queue halt \"<why>\" halts it")
        self.halt.resume()
        self.slots.grant_all_environments(context)
        return "the process queue is resumed"
