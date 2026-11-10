from engine.time.clock import Clock
from engine.container.container import Container
from core.modules.demo.support.demo_folders import DemoFolders


class DemoFolderPruning:
    """The scratch folders of demos that no longer run are removed."""

    def __call__(self, container: Container) -> None:
        DemoFolders(container.get(Clock)).prune()
