from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.processes.commands.grant_run_slots.grant_run_slots import GrantRunSlots
from core.modules.processes.support.run_slots import RunSlots


class GrantRunSlotsHandler(Handler[GrantRunSlots, None]):
    """Grants the free spots to the queued runs and takes the count of each run that has listed its tests."""

    command = GrantRunSlots
    runs_once = True

    def __init__(self, slots: RunSlots) -> None:
        self.slots = slots

    def handle(self, command: GrantRunSlots, context: Context) -> None:
        self.slots.grant_all_environments(context)
        self.slots.claim_counts(context)
