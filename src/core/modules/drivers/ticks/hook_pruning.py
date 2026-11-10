from engine.actor.actor import Actor
from core.base.command.bus import Bus
from engine.container.container import Container
from core.modules.drivers.commands.prune_hook_calls.prune_hook_calls import PruneHookCalls
from core.modules.drivers.commands.prune_temp_folders.prune_temp_folders import PruneTempFolders


class HookPruning:
    """The old hook calls are pruned and the temp folders of ended sessions removed."""

    def __call__(self, container: Container) -> None:
        container.get(Bus).run(PruneHookCalls(), Actor.core())
        container.get(Bus).run(PruneTempFolders(), Actor.core())
