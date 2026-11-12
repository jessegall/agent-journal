from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from core.modules.drivers.commands.prune_hook_calls.prune_hook_calls import PruneHookCalls
from core.modules.drivers.commands.prune_temp_folders.prune_temp_folders import PruneTempFolders
from core.modules.drivers.commands.prune_runtime_folders.prune_runtime_folders import PruneRuntimeFolders


class HookPruning:
    """The old hook calls are pruned, and the temp folders of ended sessions and the stale runtime folders removed."""

    def __call__(self, container: Container) -> None:
        container.get(Bus).run(PruneHookCalls(), Actor.core())
        container.get(Bus).run(PruneTempFolders(), Actor.core())
        container.get(Bus).run(PruneRuntimeFolders(), Actor.core())
