from core.base.change.logged_event import LoggedEvent
from core.base.change.registry_synced import RegistrySynced
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.base.scope.environment_scope import EnvironmentScope
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_dock_type import ApprovalDockType
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.docking.models.enums.dock_item_state import DockItemState
from core.modules.docking.queries.dock_item_query import DockItemQuery


class PendingApprovalDockListener(CommitListener[RegistrySynced]):
    """Restores open approval cards after an upgrade or a registry refresh."""

    name = "approvals.restore-dock"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, items: DockItemQuery) -> None:
        self.bus, self.actors, self.queries, self.items = bus, actors, queries, items

    def handle(self, event: RegistrySynced, logged: LoggedEvent) -> None:
        docked = {item.target_id for item in self.items.type_items(ApprovalDockType.REQUEST.value).filter(state=DockItemState.DOCKED).all_rows()}
        requests = tuple(request for request in self.queries.query(ApprovalRequest).filter(state=ApprovalState.OPEN).all_rows() if request.id not in docked)
        for request in requests:
            self.bus.run(AddDockItem(ApprovalDockType.REQUEST.value, ApprovalRequest.model_name, request.id), self.actors.actor("journal.core.approvals"),
                         cause_id=logged.id, environment_id=request.environment_id)
