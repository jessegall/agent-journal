from engine.event.changed import Changed
from engine.event.created import Created
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit_listener import CommitListener
from engine.module.module_actors import ModuleActors
from engine.listener.event_rows import EventRows
from engine.scope.actor_scope import ActorScope
from engine.scope.environment_scope import EnvironmentScope
from core.modules.agents.models.agent import Agent
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.approvals.support.approval_nudges import APPROVAL_PENDING, APPROVAL_DECIDED, APPROVAL_REVIEW
from core.modules.drivers.commands.record_agent_nudge.record_agent_nudge import RecordAgentNudge


class ApprovalNoticeListener(CommitListener[Changed[ApprovalRequest]]):
    """Tells the requesting agent when a person was asked and when the request ends."""

    name = "approvals.notices"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, bus: Bus, actors: ModuleActors, rows: EventRows) -> None:
        self.bus, self.actors, self.rows = bus, actors, rows

    def handle(self, event: Changed[ApprovalRequest], logged: LoggedEvent) -> None:
        request = event.row
        created = isinstance(event, Created)
        routed = event.old_row is not None and event.old_row.recipient_agent_id != request.recipient_agent_id
        if not created and not routed and request.state not in (ApprovalState.ACCEPTED, ApprovalState.REFUSED, ApprovalState.CLOSED):
            return
        pending = request.state in (ApprovalState.OPEN, ApprovalState.RUNNING)
        reviewer = request.recipient_agent_id if pending else None
        review = reviewer is not None
        recipient = reviewer if reviewer is not None else request.requester_id
        agent = self.rows.find(Agent, recipient)
        if agent is None:
            return
        declaration = APPROVAL_PENDING if pending else APPROVAL_DECIDED
        if review:
            declaration = APPROVAL_REVIEW
        notice = declaration.nudge(approval=request.id, recipient=recipient) if declaration is APPROVAL_REVIEW else declaration.nudge(approval=request.id)
        self.bus.run(RecordAgentNudge(agent.id, notice, declaration.key), self.actors.actor("journal.core.approvals"),
                     cause_id=logged.id, environment_id=request.environment_id)
