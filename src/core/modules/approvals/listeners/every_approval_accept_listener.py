from engine.actor.actor import Actor
from engine.command.accept_covered_approval import AcceptCoveredApproval
from engine.command.bus import Bus
from engine.enums.actor_type import ActorType
from engine.event.created import Created
from engine.event.logged_event import LoggedEvent
from engine.listener.commit.commit_listener import CommitListener
from engine.listener.rows.event_rows import EventRows
from engine.scope.actor_scope import ActorScope
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_state import ApprovalState


class EveryApprovalAcceptListener(CommitListener[Created[ApprovalRequest]]):
    """Accepts a request that is still open once it is saved, when the setting Accept every approval is on for
    its environment, by any path that asked for it (a rule proposal, a secret, a share, a trigger), not only an
    agent's refused line, which accepts it at once itself; the accept runs as its own command, never inside
    the transaction that asked."""

    name = "approvals.every-approval-accept"
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, bus: Bus) -> None:
        self.rows, self.bus = rows, bus

    def handle(self, event: Created[ApprovalRequest], logged: LoggedEvent) -> None:
        request = self.rows.required(ApprovalRequest, event.row.id)
        if request.state is not ApprovalState.OPEN or request.standing_id is not None:
            return
        self.bus.run(AcceptCoveredApproval(), Actor(request.requester_id, ActorType.AGENT), cause_id=logged.id, environment_id=request.environment_id)
