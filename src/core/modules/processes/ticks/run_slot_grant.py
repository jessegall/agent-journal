from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from core.modules.processes.commands.grant_run_slots.grant_run_slots import GrantRunSlots


# a run that starts or ends grants at once through RunSlotListener; this only meets a queue a restart left waiting
RUN_SLOT_GRANT_SECONDS = 15


class RunSlotGrant:
    """Gives the free spots to the queued runs, so a queue a restart held starts again once the restart is done."""

    def __call__(self, container: Container) -> None:
        container.get(Bus).run(GrantRunSlots(), Actor.core())
