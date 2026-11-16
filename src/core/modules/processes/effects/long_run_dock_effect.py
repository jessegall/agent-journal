from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.support.run_docking import LONG_RUN_DOCK_KEY, RunDocking


class LongRunDockEffect(EventEffect):
    """Docks the agent's visible runs once they have run for the dock seconds, at every hook and at its minute step;
    the name a docked run lacks is asked for by the hold LongRunDockNeeds plans."""

    key = LONG_RUN_DOCK_KEY
    events = list(HookEventName)

    def __init__(self, docking: RunDocking) -> None:
        self.docking = docking

    def effect_commands(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        return self.docking.docked(event, agent_id).commands
