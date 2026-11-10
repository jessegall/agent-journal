from engine.actor.actor import Actor
from core.base.command.bus import Bus
from engine.container.container import Container
from engine.query.queries import Queries
from core.modules.environments.models.environment import Environment
from core.modules.processes.commands.prune_processes.prune_processes import PruneProcesses


class ProcessPruning:
    """Prunes ended processes in every environment."""

    def __call__(self, container: Container) -> None:
        for environment in container.get(Queries).query(Environment).all_rows():
            container.get(Bus).run(PruneProcesses(), Actor.core(), environment_id=environment.id)
