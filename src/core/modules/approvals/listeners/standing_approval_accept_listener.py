from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.event.changed import Changed
from engine.event.created import Created
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit.commit_listener import CommitListener
from engine.listener.rows.event_rows import EventRows
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.approvals.commands.answer_approval.answer_approval import AnswerApproval
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_decision import ApprovalDecision
from core.modules.approvals.models.lifecycles.approval_lifecycle import ApprovalLifecycle
from core.modules.approvals.models.standing_approval import StandingApproval


class StandingApprovalAcceptListener(CommitListener[Changed[ApprovalRequest]]):
    """Accepts a request saved under a standing yes that nothing has answered since, as the person who gave
    that yes, as it is saved and again when a restart cut its command off, so the accepted command runs on its own like one a person accepted, never inside the
    transaction that asked for it; an agent's own line answers it at once instead, and a failed accept
    leaves the request in the dock."""

    name = "approvals.standing-accept"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, rows: EventRows, bus: Bus) -> None:
        self.queries, self.rows, self.bus = queries, rows, bus

    def handle(self, event: Changed[ApprovalRequest], logged: LoggedEvent) -> None:
        request = event.row
        if request.standing_id is None or not (isinstance(event, Created) or event.move is ApprovalLifecycle.recover) or self.rows.required(ApprovalRequest, request.id).version != request.version:
            return
        standing = self.queries.query(StandingApproval).find(request.standing_id)
        self.bus.run(AnswerApproval(request.id, ApprovalDecision.ACCEPT), Actor(standing.creator_id, ActorType.USER), cause_id=logged.id,
                     environment_id=request.environment_id)
