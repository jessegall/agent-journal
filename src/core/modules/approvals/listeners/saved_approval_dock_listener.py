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
from core.modules.approvals.models.saved_approval import SavedApproval
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem


class SavedApprovalDockListener(CommitListener[Changed[ApprovalRequest]]):
    """Docks a passing notice that names the request a saved yes has let through and why, with a button to
    withdraw that yes."""

    name = "approvals.saved-dock"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, bus: Bus, actors: ModuleActors) -> None:
        self.bus, self.actors = bus, actors

    def handle(self, event: Changed[ApprovalRequest], logged: LoggedEvent) -> None:
        request = event.row
        if event.old_row is None or request.saved_approval_id is None or request.state is not ApprovalState.ACCEPTED or event.old_row.state is ApprovalState.ACCEPTED:
            return
        self.bus.run(AddDockItem(ApprovalDockType.SAVED_USED.value, SavedApproval.cli_name, request.saved_approval_id, text=request.text.splitlines()[0]), self.actors.actor("journal.core.approvals"),
                     cause_id=logged.id, environment_id=request.environment_id)
