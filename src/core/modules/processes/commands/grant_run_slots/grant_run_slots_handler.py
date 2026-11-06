from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.processes.commands.grant_run_slots.grant_run_slots import GrantRunSlots
from core.modules.processes.support.run_slots import RunSlots


class GrantRunSlotsHandler(Handler[GrantRunSlots, None]):
    """Grants the free spots to the queued runs."""

    command = GrantRunSlots
    runs_once = True

    def __init__(self, slots: RunSlots) -> None:
        self.slots = slots

    def handle(self, command: GrantRunSlots, context: Context) -> None:
        self.slots.grant_all_environments(context)
