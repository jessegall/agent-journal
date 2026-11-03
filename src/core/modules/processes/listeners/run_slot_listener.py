from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.modules.processes.models.process import Process
from core.modules.processes.support.run_slots import RunSlots


class RunSlotListener(SaveListener):
    """The queue of an environment's runs: whenever one of its runs starts or ends, its queued runs get a spot,
    oldest first, while fewer hold one than the environment's batch size, and none while the queue is halted. The
    runner holds a queued run's line until its spot is written. The main agent's runs never queue and hold no spot."""

    name = "processes.run-slots"
    event = "process.*"

    def __init__(self, slots: RunSlots) -> None:
        self.slots = slots

    def handle(self, change: Change[Model]) -> None:
        run = change.new_row
        if isinstance(run, Process):
            self.slots.grant(run.environment_id, change.context)
