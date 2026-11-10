from engine.change.created import Created
from engine.change.logged_event import LoggedEvent
from engine.change.updated import Updated
from engine.command.bus import Bus
from engine.command.close_user_approval import CloseUserApproval
from engine.listener.commit_listener import CommitListener
from engine.module.module_actors import ModuleActors
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from engine.scope.environment_scope import EnvironmentScope
from engine.scope.scopes import Scopes
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.settings.models.setting import Setting
from core.modules.settings.support.setting_revision import SettingRevision

REVISION_FLAG = "--expected-revision"


class OutdatedSettingApprovalListener(CommitListener[Created[Setting] | Updated[Setting]]):
    """Closes an open approval of a setting change when that setting changed after the approval was asked for, so a
    person never presses a card that can only fail."""

    name = "setting-requests.outdated"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, scopes: Scopes, revision: SettingRevision) -> None:
        self.bus, self.actors, self.queries, self.scopes, self.revision = bus, actors, queries, scopes, revision

    def handle(self, event: Created[Setting] | Updated[Setting], logged: LoggedEvent) -> None:
        key = event.row.key
        outdated = {(request.arguments, request.environment_id): request for request in self.queries.query(ApprovalRequest).filter(state=ApprovalState.OPEN).all_rows()
                    if self.is_outdated(request, key)}
        for request in outdated.values():
            self.bus.run(CloseUserApproval(request.arguments, f"outdated: {key} changed since this change was asked for"), self.actors.actor("journal.core.setting-requests"),
                         cause_id=logged.id, environment_id=request.environment_id)

    def is_outdated(self, request: ApprovalRequest, key: str) -> bool:
        arguments = request.arguments
        if arguments[:3] != ("setting", "set", key) or REVISION_FLAG not in arguments:
            return False
        with self.scopes.opened(None, request.environment_id):
            return arguments[arguments.index(REVISION_FLAG) + 1] != self.revision.current(key)
