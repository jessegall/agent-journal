from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from core.modules.tasks.commands.repair_task_states.repair_task_states import RepairTaskStates

SCAN_SECONDS = 3600


class TaskStateRound:
    """Every hour repairs the task states that should never exist, for a journal an older version or a lost
    event left so."""

    def __call__(self, container: Container) -> None:
        container.get(Bus).run(RepairTaskStates(), Actor.core())
