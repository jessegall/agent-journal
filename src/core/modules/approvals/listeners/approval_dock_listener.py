from engine.event.changed import Changed
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit.commit_listener import CommitListener
from engine.module.module_actors import ModuleActors
from engine.scope.actor_scope import ActorScope
from engine.scope.environment_scope import EnvironmentScope
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_dock_type import ApprovalDockType
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.docking.commands.remove_dock_item.remove_dock_item import RemoveDockItem
from core.modules.docking.models.enums.dock_item_state import DockItemState
from core.modules.docking.queries.dock_item_query import DockItemQuery


class ApprovalDockListener(CommitListener[Changed[ApprovalRequest]]):
    """Keeps open approval requests in the dock until a user decides them; one a standing yes covers is
    never docked, and one that fails ends failed and leaves the dock; one a restart cut off is accepted again with no card."""

    name = "approvals.dock"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, bus: Bus, actors: ModuleActors, items: DockItemQuery) -> None:
        self.bus, self.actors, self.items = bus, actors, items

    def handle(self, event: Changed[ApprovalRequest], logged: LoggedEvent) -> None:
        request = event.row
        items = tuple(self.items.type_items(ApprovalDockType.REQUEST.value).row_items(ApprovalRequest.model_name, request.id).filter(state=DockItemState.DOCKED).get())
        actor = self.actors.actor("journal.core.approvals")
        if self.shows_card(request):
            if not items:
                self.bus.run(AddDockItem(ApprovalDockType.REQUEST.value, ApprovalRequest.model_name, request.id), actor,
                             cause_id=logged.id, environment_id=request.environment_id)
            return
        for item in items:
            self.bus.run(RemoveDockItem(item.id), actor, cause_id=logged.id, environment_id=request.environment_id)

    @staticmethod
    def shows_card(request: ApprovalRequest) -> bool:
        return request.recipient_agent_id is None and request.standing_id is None and request.state in (ApprovalState.OPEN, ApprovalState.RUNNING)
