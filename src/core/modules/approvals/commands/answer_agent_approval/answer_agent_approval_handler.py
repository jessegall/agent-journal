from engine.enums.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from engine.errors.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.approvals.commands.answer_agent_approval.answer_agent_approval import AnswerAgentApproval
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.approvals.models.lifecycles.approval_lifecycle import ApprovalLifecycle


class AnswerAgentApprovalHandler(Handler[AnswerAgentApproval, ApprovalRequest]):
    command = AnswerAgentApproval

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: AnswerAgentApproval, context: Context) -> ApprovalRequest:
        request = self.queries.query(ApprovalRequest).find(command.request_id)
        if context.actor.type is not ActorType.AGENT or request.recipient_agent_id != context.actor.id:
            raise Refusal("only the main agent addressed by this request can answer it")
        if request.state is not ApprovalState.OPEN or not command.text.strip():
            raise Refusal("answer an open request with the guidance the asking agent needs")
        answered = request.moved(ApprovalLifecycle.close, review_answer=command.text.strip(), responder_id=context.actor.id)
        return self.repository.save_change(request, answered, context)
