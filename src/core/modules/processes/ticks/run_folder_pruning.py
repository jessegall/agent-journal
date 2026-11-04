from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.container import Container
from core.modules.processes.commands.prune_run_folders.prune_run_folders import PruneRunFolders


class RunFolderPruning:
    """The folders of ended runs that kept no output are removed."""

    def __call__(self, container: Container) -> None:
        container.get(Bus).run(PruneRunFolders(), Actor.core())
