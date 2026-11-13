from engine.enums.actor_type import ActorType
from engine.command.close_user_approval import CloseUserApproval
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.approvals.models.lifecycles.approval_lifecycle import ApprovalLifecycle


class CloseUserApprovalHandler(Handler[CloseUserApproval, object]):
    """Closes open cards when their source action was resolved elsewhere."""

    command = CloseUserApproval

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: CloseUserApproval, context: Context) -> None:
        if context.actor.is_agent():
            raise Refusal("an agent cannot close an approval request")
        requests = tuple(self.queries.query(ApprovalRequest).filter(state=ApprovalState.OPEN, arguments=command.arguments).get())
        for request in requests:
            self.repository.save_change(request, request.moved(ApprovalLifecycle.close, review_answer=command.reason), context)
