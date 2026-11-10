from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from core.modules.processes.commands.grant_run_slots.grant_run_slots import GrantRunSlots


class RunSlotGrant:
    """Gives the free spots to the queued runs, so a queue a restart held starts again once the restart is done."""

    def __call__(self, container: Container) -> None:
        container.get(Bus).run(GrantRunSlots(), Actor.core())
