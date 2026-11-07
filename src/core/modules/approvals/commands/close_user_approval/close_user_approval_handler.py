from core.base.actor_type import ActorType
from core.base.command.close_user_approval import CloseUserApproval
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.approvals.models.lifecycles.approval_lifecycle import ApprovalLifecycle


class CloseUserApprovalHandler(Handler[CloseUserApproval, object]):
    """Closes open cards when their source action was resolved elsewhere."""

    command = CloseUserApproval

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: CloseUserApproval, context: Context) -> None:
        if context.actor.type is ActorType.AGENT:
            raise Refusal("an agent cannot close an approval request")
        requests = tuple(self.queries.query(ApprovalRequest).filter(state=ApprovalState.OPEN, arguments=command.arguments).all_rows())
        for request in requests:
            self.repository.save_change(request, request.moved(ApprovalLifecycle.close, review_answer=command.reason), context)
