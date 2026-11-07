from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.approvals.commands.move_approval.move_approval import MoveApproval
from core.modules.approvals.models.approval_request import ApprovalRequest


class MoveApprovalHandler(Handler[MoveApproval, ApprovalRequest]):
    command = MoveApproval

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: MoveApproval, context: Context) -> ApprovalRequest:
        if context.actor.type is not ActorType.USER:
            raise Refusal("an agent cannot decide an approval request")
        request = self.queries.query(ApprovalRequest).find(command.row_id)
        if request.recipient_agent_id is not None:
            raise Refusal(f"this approval is addressed to agent {request.recipient_agent_id}")
        if request.required_person_id is not None and request.required_person_id != context.actor.id:
            raise Refusal("this approval belongs to another person")
        return self.repository.save_change(request, request.moved(command.move), context)
