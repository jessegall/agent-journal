from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.command.request_user_approval import RequestUserApproval
from core.base.database.actor_table import ActorTable
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.agents.support.main_agent_finder import MainAgentFinder


class RequestUserApprovalHandler(Handler[RequestUserApproval, object]):
    """Keeps one open request for an agent's repeated attempt at the same action."""

    command = RequestUserApproval

    def __init__(self, queries: Queries, repository: Repository, actors: ActorTable) -> None:
        self.queries, self.repository = queries, repository
        self.actors = actors

    def handle(self, command: RequestUserApproval, context: Context) -> ApprovalRequest:
        requester_id = command.requester_id if command.requester_id is not None else context.actor.id
        if not self.actors.is_agent(requester_id):
            main = MainAgentFinder.newest(self.queries)
            if main is not None:
                requester_id = main.id
        requests = self.queries.query(ApprovalRequest).filter(requester_id=requester_id, arguments=command.arguments,
                                                            refused_arguments=command.approval.refused_arguments, required_person_id=command.approval.required_person_id,
                                                            continued_arguments=command.approval.continued_arguments)
        existing = requests.matching(Among("state", (ApprovalState.OPEN, ApprovalState.RUNNING))).first()
        if existing is not None:
            if existing.text != command.approval.reason:
                return self.repository.update(existing, context, text=command.approval.reason)
            return existing
        return self.repository.save(ApprovalRequest(creator_id=context.actor.id, requester_id=requester_id, text=command.approval.reason,
                                                    arguments=command.arguments, refused_arguments=command.approval.refused_arguments,
                                                    required_person_id=command.approval.required_person_id,
                                                    continued_arguments=command.approval.continued_arguments), context)
