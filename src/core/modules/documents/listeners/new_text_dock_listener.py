from typing import ClassVar

from engine.change.changed import RowChange
from engine.change.logged_event import LoggedEvent
from engine.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from engine.scope.actor_scope import ActorScope
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.documents.models.enums.text_dock_type import TextDockType


DOCUMENTS_MODULE = "journal.core.documents"


class NewTextDockListener(CommitListener[RowChange]):
    """Docks a new project document or report in the chat where it was created."""

    dock_type: ClassVar[TextDockType]
    disabled_scopes = [ActorScope]

    def __init__(self, bus: Bus, actors: ModuleActors) -> None:
        self.bus, self.actors = bus, actors

    def handle(self, event: RowChange, logged: LoggedEvent) -> None:
        row = event.row
        if self.bus.scopes.environment_id is None:
            return
        self.bus.run(AddDockItem(self.dock_type.value, row.model_name, row.id), self.actors.actor(DOCUMENTS_MODULE), cause_id=logged.id)
