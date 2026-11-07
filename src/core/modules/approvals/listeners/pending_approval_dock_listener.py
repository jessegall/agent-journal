from core.base.change.logged_event import LoggedEvent
from core.base.change.registry_synced import RegistrySynced
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.query.conditions.among import Among
from core.base.scope.actor_scope import ActorScope
from core.base.scope.environment_scope import EnvironmentScope
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_dock_type import ApprovalDockType
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.docking.commands.remove_dock_item.remove_dock_item import RemoveDockItem
from core.modules.docking.models.enums.dock_item_state import DockItemState
from core.modules.docking.queries.dock_item_query import DockItemQuery


class PendingApprovalDockListener(CommitListener[RegistrySynced]):
    """Restores open approval cards after an upgrade or a registry refresh."""

    name = "approvals.restore-dock"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, items: DockItemQuery) -> None:
        self.bus, self.actors, self.queries, self.items = bus, actors, queries, items

    def handle(self, event: RegistrySynced, logged: LoggedEvent) -> None:
        items = tuple(self.items.type_items(ApprovalDockType.REQUEST.value).filter(state=DockItemState.DOCKED).all_rows())
        docked = {item.target_id for item in items}
        requests = tuple(self.queries.query(ApprovalRequest).filter(recipient_agent_id=None).matching(
            Among("state", (ApprovalState.OPEN, ApprovalState.RUNNING))).all_rows())
        pending = {request.id for request in requests}
        actor = self.actors.actor("journal.core.approvals")
        for item in items:
            if item.target_id not in pending:
                self.bus.run(RemoveDockItem(item.id), actor, cause_id=logged.id, environment_id=logged.environment_id)
        for request in requests:
            if request.id in docked:
                continue
            self.bus.run(AddDockItem(ApprovalDockType.REQUEST.value, ApprovalRequest.model_name, request.id), actor,
                         cause_id=logged.id, environment_id=request.environment_id)
