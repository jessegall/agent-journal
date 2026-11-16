from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.approvals.commands.make_saved_approval.make_saved_approval import MakeSavedApproval
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.saved_approval import SavedApproval
from core.modules.approvals.support.saved_approvals import SavedApprovals


class MakeSavedApprovalHandler(Handler[MakeSavedApproval, SavedApproval]):
    """Saves the saved yes of the user, drawn from the request, once for what it covers."""

    command = MakeSavedApproval

    def __init__(self, queries: Queries, repository: Repository, saved: SavedApprovals) -> None:
        self.queries, self.repository, self.saved = queries, repository, saved

    def handle(self, command: MakeSavedApproval, context: Context) -> SavedApproval:
        request = self.queries.query(ApprovalRequest).find(command.request_id)
        made = self.saved.build_saved(request, command.scope, context.actor.id)
        existing = self.saved.covering(request)
        if existing is not None and existing.scope is command.scope and existing.creator_id == context.actor.id:
            return existing
        return self.repository.save(made, context)
