from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.errors.refusal import Refusal
from core.modules.environments.support.environment_rows import EnvironmentRows
from suites.coding.modules.workers.commands.remove_orphan_worktrees.remove_orphan_worktrees import RemoveOrphanWorktrees


class OrphanWorktreeSweep:
    """Sweeps away the worktrees no worker holds in every environment that is a repository, from a server thread
    that holds no write turn, since the sweep runs git."""

    def __init__(self, environments: EnvironmentRows, bus: Bus) -> None:
        self.environments, self.bus = environments, bus

    def sweep(self) -> None:
        for environment in self.environments.all():
            try:
                self.bus.run(RemoveOrphanWorktrees(), Actor.core(), environment_id=environment.id)
            except Refusal:
                continue
