from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.docking.commands.make_dock.make_dock import MakeDock
from core.modules.docking.models.dock import Dock
from core.modules.docking.support.environment_docks import EnvironmentDocks


class MakeDockHandler(Handler[MakeDock, Dock]):
    """Saves the environment's dock when it has none."""

    command = MakeDock

    def __init__(self, docks: EnvironmentDocks, repository: Repository) -> None:
        self.docks, self.repository = docks, repository

    def handle(self, command: MakeDock, context: Context) -> Dock:
        existing = self.docks.find()
        if existing is not None:
            return existing
        saved = self.repository.save(Dock(creator_id=context.actor.id), context)
        self.docks.remember(saved)
        return saved
