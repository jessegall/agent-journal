from core.base.change.changed import Changed
from core.base.change.created import Created
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.base.scope.environment_scope import EnvironmentScope
from core.modules.agents.models.agent import Agent
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.approvals.support.approval_nudges import APPROVAL_PENDING, APPROVAL_DECIDED, APPROVAL_REVIEW
from core.modules.drivers.commands.record_agent_nudge.record_agent_nudge import RecordAgentNudge


class ApprovalNoticeListener(CommitListener[Changed[ApprovalRequest]]):
    """Tells the requesting agent when a person was asked and when the request ends."""

    name = "approvals.notices"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries) -> None:
        self.bus, self.actors, self.queries = bus, actors, queries

    def handle(self, event: Changed[ApprovalRequest], logged: LoggedEvent) -> None:
        request = event.row
        created = isinstance(event, Created)
        relayed = not created and event.old_row.recipient_agent_id is not None and request.recipient_agent_id is None
        if not created and not relayed and request.state not in (ApprovalState.ACCEPTED, ApprovalState.REFUSED, ApprovalState.CLOSED):
            return
        recipient = request.recipient_agent_id if request.recipient_agent_id is not None else request.requester_id
        agent = self.queries.query(Agent).filter(id=recipient).first()
        if agent is None:
            return
        declaration = APPROVAL_PENDING if created or relayed else APPROVAL_DECIDED
        if request.recipient_agent_id is not None:
            declaration = APPROVAL_REVIEW
        notice = declaration.nudge(approval=request.id, recipient=recipient) if declaration is APPROVAL_REVIEW else declaration.nudge(approval=request.id)
        self.bus.run(RecordAgentNudge(agent.id, notice, declaration.key), self.actors.actor("journal.core.approvals"),
                     cause_id=logged.id, environment_id=request.environment_id)
