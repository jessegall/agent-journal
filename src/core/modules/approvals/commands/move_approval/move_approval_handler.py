from engine.enums.actor_type import ActorType
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.approvals.commands.move_approval.move_approval import MoveApproval
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.lifecycles.approval_lifecycle import ApprovalLifecycle
from core.modules.approvals.support.approval_restarts import ApprovalRestarts
from core.modules.agents.support.agent_label import AgentLabel
from core.modules.agents.models.agent import Agent


class MoveApprovalHandler(Handler[MoveApproval, ApprovalRequest]):
    command = MoveApproval

    def __init__(self, queries: Queries, repository: Repository, restarts: ApprovalRestarts) -> None:
        self.queries, self.repository, self.restarts = queries, repository, restarts

    def handle(self, command: MoveApproval, context: Context) -> ApprovalRequest:
        if context.actor.type is not ActorType.USER:
            raise Refusal("an agent cannot decide an approval request")
        request = self.queries.query(ApprovalRequest).find(command.row_id)
        if request.recipient_agent_id is not None:
            raise Refusal(f"this approval is addressed to {AgentLabel.from_agent(self.queries.query(Agent).find(request.recipient_agent_id)).text}")
        if request.required_person_id is not None and request.required_person_id != context.actor.id:
            raise Refusal("this approval belongs to another user")
        if command.move is ApprovalLifecycle.begin and self.restarts.interrupted(request):
            request = self.repository.save_change(request, request.moved(ApprovalLifecycle.retry), context)
        return self.repository.save_change(request, request.moved(command.move), context)
