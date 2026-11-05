from typing import ClassVar

from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.documents.models.enums.text_dock_type import TextDockType
from core.modules.documents.models.text_row import TextRow
from core.base.change.event_subscriber import E


DOCUMENTS_MODULE = "journal.core.documents"


class NewTextDockListener(CommitListener[E]):
    """Docks a new project document or report in the chat where it was created."""

    dock_type: ClassVar[TextDockType]
    disabled_scopes = [ActorScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries) -> None:
        self.bus, self.actors, self.queries = bus, actors, queries

    def handle(self, event: E, logged: LoggedEvent) -> None:
        row = event.row
        environment_id = logged.environment_id or next((agent.environment_id for agent in self.queries.query(Agent).filter(id=row.creator_id).limited(1)), None)
        if environment_id is None:
            return
        self.bus.run(AddDockItem(environment_id, self.dock_type.value, row.model_name, row.id), self.actors.actor(DOCUMENTS_MODULE), cause_id=logged.id, environment_id=environment_id)
