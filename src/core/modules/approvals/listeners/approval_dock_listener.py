from core.base.change.changed import Changed
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.scope.actor_scope import ActorScope
from core.base.scope.environment_scope import EnvironmentScope
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_dock_type import ApprovalDockType
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.docking.commands.remove_dock_item.remove_dock_item import RemoveDockItem
from core.modules.docking.models.enums.dock_item_state import DockItemState
from core.modules.docking.queries.dock_item_query import DockItemQuery


class ApprovalDockListener(CommitListener[Changed[ApprovalRequest]]):
    """Keeps open approval requests in the dock until a person decides them."""

    name = "approvals.dock"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, bus: Bus, actors: ModuleActors, items: DockItemQuery) -> None:
        self.bus, self.actors, self.items = bus, actors, items

    def handle(self, event: Changed[ApprovalRequest], logged: LoggedEvent) -> None:
        request = event.row
        items = tuple(self.items.type_items(ApprovalDockType.REQUEST.value).row_items(ApprovalRequest.model_name, request.id).filter(state=DockItemState.DOCKED).all_rows())
        actor = self.actors.actor("journal.core.approvals")
        if request.state in (ApprovalState.OPEN, ApprovalState.RUNNING) and request.recipient_agent_id is None:
            if not items:
                self.bus.run(AddDockItem(ApprovalDockType.REQUEST.value, ApprovalRequest.model_name, request.id), actor,
                             cause_id=logged.id, environment_id=request.environment_id)
            return
        for item in items:
            self.bus.run(RemoveDockItem(item.id), actor, cause_id=logged.id, environment_id=request.environment_id)
