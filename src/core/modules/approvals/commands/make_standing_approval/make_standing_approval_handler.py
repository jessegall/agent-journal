from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.approvals.commands.make_standing_approval.make_standing_approval import MakeStandingApproval
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.standing_approval import StandingApproval
from core.modules.approvals.support.standing_approvals import StandingApprovals


class MakeStandingApprovalHandler(Handler[MakeStandingApproval, StandingApproval]):
    """Saves the standing yes of the person, drawn from the request, once for what it covers."""

    command = MakeStandingApproval

    def __init__(self, queries: Queries, repository: Repository, standing: StandingApprovals) -> None:
        self.queries, self.repository, self.standing = queries, repository, standing

    def handle(self, command: MakeStandingApproval, context: Context) -> StandingApproval:
        request = self.queries.query(ApprovalRequest).find(command.request_id)
        made = self.standing.build_standing(request, command.scope, context.actor.id)
        existing = self.standing.covering(request)
        if existing is not None and existing.scope is command.scope and existing.creator_id == context.actor.id:
            return existing
        return self.repository.save(made, context)
