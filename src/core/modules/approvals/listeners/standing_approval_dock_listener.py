from core.base.change.changed import Changed
from core.base.change.created import Created
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.scope.actor_scope import ActorScope
from core.base.scope.environment_scope import EnvironmentScope
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_dock_type import ApprovalDockType
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.approvals.models.standing_approval import StandingApproval
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem


class StandingApprovalDockListener(CommitListener[Changed[ApprovalRequest]]):
    """Docks a passing notice that says which request a standing yes has let through, with a button to
    withdraw that yes."""

    name = "approvals.standing-dock"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, bus: Bus, actors: ModuleActors) -> None:
        self.bus, self.actors = bus, actors

    def handle(self, event: Changed[ApprovalRequest], logged: LoggedEvent) -> None:
        request = event.row
        if isinstance(event, Created) or request.standing_id is None or request.state is not ApprovalState.ACCEPTED or event.old_row.state is ApprovalState.ACCEPTED:
            return
        self.bus.run(AddDockItem(ApprovalDockType.STANDING_USED.value, StandingApproval.cli_name, request.standing_id, title_detail=request.text.splitlines()[0]), self.actors.actor("journal.core.approvals"),
                     cause_id=logged.id, environment_id=request.environment_id)
