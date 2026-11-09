from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.approvals.commands.relay_approval.relay_approval import RelayApproval
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_state import ApprovalState


class RelayApprovalHandler(Handler[RelayApproval, ApprovalRequest]):
    command = RelayApproval

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RelayApproval, context: Context) -> ApprovalRequest:
        request = self.queries.query(ApprovalRequest).find(command.request_id)
        if context.actor.type is not ActorType.AGENT or request.recipient_agent_id != context.actor.id:
            raise Refusal("only the main agent addressed by this request can relay it to a person")
        if request.state is not ApprovalState.OPEN:
            raise Refusal("only an open approval can be relayed")
        return self.repository.update(request, context, recipient_agent_id=None, relayer_id=context.actor.id)
