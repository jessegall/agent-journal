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


DOCUMENTS_MODULE = "journal.core.documents"


class NewTextDockListener(CommitListener):
    """A new document or report is docked above the chat of its environment, or of the agent that wrote it."""

    row_model: ClassVar[type[TextRow]]
    dock_type: ClassVar[TextDockType]
    disabled_scopes = [ActorScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries) -> None:
        self.bus, self.actors, self.queries = bus, actors, queries

    def handle(self, event: LoggedEvent) -> None:
        row = self.queries.query(self.row_model).find(event.row_id)
        environment_id = row.environment_id or next((agent.environment_id for agent in self.queries.query(Agent).filter(id=row.creator_id).page(1, 1).rows), None)
        if environment_id is not None:
            self.bus.run(AddDockItem(environment_id, self.dock_type.value, self.row_model.model_name, row.id), self.actors.actor(DOCUMENTS_MODULE), cause_id=event.id, environment_id=environment_id)
