from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.accept_covered_approval import AcceptCoveredApproval
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.conditions.has_value import HasValue
from core.base.query.queries import Queries
from core.modules.approvals.commands.answer_approval.answer_approval import AnswerApproval
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_decision import ApprovalDecision
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.approvals.models.standing_approval import StandingApproval


class AcceptCoveredApprovalHandler(Handler[AcceptCoveredApproval, str | None]):
    """Accepts the caller's newest open request a standing yes covers, as the person who gave that yes, and gives what
    the accepted command printed; a command that fails is refused with its reason, and the request waits in the dock."""

    command = AcceptCoveredApproval

    def __init__(self, queries: Queries, bus: Bus) -> None:
        self.queries, self.bus = queries, bus

    def handle(self, command: AcceptCoveredApproval, context: Context) -> str | None:
        request = self.queries.query(ApprovalRequest).filter(requester_id=context.actor.id, state=ApprovalState.OPEN).matching(HasValue("standing_id")).newest().first()
        if request is None or request.standing_id is None:
            return None
        standing = self.queries.query(StandingApproval).find(request.standing_id)
        result = self.bus.run(AnswerApproval(request.id, ApprovalDecision.ACCEPT), Actor(standing.creator_id, ActorType.USER), environment_id=request.environment_id)
        return f"standing yes {standing.id} accepted approval {request.id}\n{result.output}".rstrip()
