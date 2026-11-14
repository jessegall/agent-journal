from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from core.modules.drivers.commands.prune_temp_folders.prune_temp_folders import PruneTempFolders
from core.modules.drivers.commands.prune_runtime_folders.prune_runtime_folders import PruneRuntimeFolders


class HookPruning:
    """The temp folders of ended sessions and the stale runtime folders are removed; rows are pruned by RowPruning."""

    def __call__(self, container: Container) -> None:
        container.get(Bus).run(PruneTempFolders(), Actor.core())
        container.get(Bus).run(PruneRuntimeFolders(), Actor.core())
