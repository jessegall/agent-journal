import logging

from engine.enums.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from engine.scope.environment_scope import EnvironmentScope
from core.modules.approvals.commands.recover_approvals.recover_approvals import RecoverApprovals
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.approvals.models.lifecycles.approval_lifecycle import ApprovalLifecycle
from core.modules.approvals.support.approval_restarts import ApprovalRestarts


class RecoverApprovalsHandler(Handler[RecoverApprovals, int]):
    """Reopens the claims a server left running when it stopped, as the journal starts."""

    command = RecoverApprovals
    disabled_scopes = [EnvironmentScope]

    def __init__(self, queries: Queries, repository: Repository, restarts: ApprovalRestarts) -> None:
        self.queries, self.repository, self.restarts = queries, repository, restarts

    def handle(self, command: RecoverApprovals, context: Context) -> int:
        if context.actor.type is not ActorType.CORE:
            raise Refusal("only the server can recover approval requests")
        recovered = 0
        for request in self.queries.query(ApprovalRequest).filter(state=ApprovalState.RUNNING).all_rows():
            if not self.restarts.interrupted(request):
                continue
            self.repository.save_change(request, request.moved(ApprovalLifecycle.recover), context)
            logging.warning("approval %s reopened after the server stopped during its action", request.id)
            recovered += 1
        return recovered
