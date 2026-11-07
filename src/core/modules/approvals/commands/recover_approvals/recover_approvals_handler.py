import logging

from core.base.actor_type import ActorType
from core.base.change.event_log import EventLog, JOURNAL_BOOTING_EVENT
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.scope.environment_scope import EnvironmentScope
from core.modules.approvals.commands.recover_approvals.recover_approvals import RecoverApprovals
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.approvals.models.lifecycles.approval_lifecycle import ApprovalLifecycle

RECOVERY_SECONDS = 300


class RecoverApprovalsHandler(Handler[RecoverApprovals, int]):
    """Reopens old claims left by a server that has stopped."""

    command = RecoverApprovals
    disabled_scopes = [EnvironmentScope]

    def __init__(self, queries: Queries, repository: Repository, events: EventLog) -> None:
        self.queries, self.repository, self.events = queries, repository, events

    def handle(self, command: RecoverApprovals, context: Context) -> int:
        if context.actor.type is not ActorType.CORE:
            raise Refusal("only the server can recover approval requests")
        boot = self.events.latest_event(JOURNAL_BOOTING_EVENT)
        if boot is None:
            return 0
        recovered = 0
        for request in self.queries.query(ApprovalRequest).filter(state=ApprovalState.RUNNING).all_rows():
            updated_at = request.update_timestamp()
            if updated_at >= boot.timestamp or updated_at.elapsed_seconds(context.timestamp) < RECOVERY_SECONDS:
                continue
            self.repository.save_change(request, request.moved(ApprovalLifecycle.retry), context)
            logging.warning("approval %s reopened after the server stopped during its action", request.id)
            recovered += 1
        return recovered
