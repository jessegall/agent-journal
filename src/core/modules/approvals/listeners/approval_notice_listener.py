from engine.event.changed import Changed
from engine.event.created import Created
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit.commit_listener import CommitListener
from engine.module.module_actors import ModuleActors
from engine.listener.rows.event_rows import EventRows
from engine.scope.actor_scope import ActorScope
from engine.scope.environment_scope import EnvironmentScope
from core.modules.agents.models.agent import Agent
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.approvals.nudges.approval_pending_nudge import ApprovalPendingNudge
from core.modules.approvals.nudges.approval_decided_nudge import ApprovalDecidedNudge
from core.modules.approvals.nudges.approval_failed_nudge import ApprovalFailedNudge
from core.modules.approvals.nudges.approval_review_nudge import ApprovalReviewNudge
from core.modules.drivers.commands.record_agent_nudge.record_agent_nudge import RecordAgentNudge


class ApprovalNoticeListener(CommitListener[Changed[ApprovalRequest]]):
    """Tells the requesting agent when a user was asked and when the request ends."""

    name = "approvals.notices"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, bus: Bus, actors: ModuleActors, rows: EventRows) -> None:
        self.bus, self.actors, self.rows = bus, actors, rows

    def handle(self, event: Changed[ApprovalRequest], logged: LoggedEvent) -> None:
        request = event.row
        created = isinstance(event, Created)
        routed = event.old_row is not None and event.old_row.recipient_agent_id != request.recipient_agent_id
        if not created and not routed and request.state not in (ApprovalState.ACCEPTED, ApprovalState.REFUSED, ApprovalState.CLOSED, ApprovalState.FAILED):
            return
        pending = request.state in (ApprovalState.OPEN, ApprovalState.RUNNING)
        reviewer = request.recipient_agent_id if pending else None
        review = reviewer is not None
        recipient = reviewer if reviewer is not None else request.requester_id
        agent = self.rows.find(Agent, recipient)
        if agent is None:
            return
        declaration = ApprovalPendingNudge.declared() if pending else ApprovalDecidedNudge.declared()
        if request.state is ApprovalState.FAILED:
            declaration = ApprovalFailedNudge.declared()
        if review:
            declaration = ApprovalReviewNudge.declared()
        notice = declaration.nudge(approval=request.id, recipient=recipient) if declaration is ApprovalReviewNudge.declared() else declaration.nudge(approval=request.id)
        self.bus.run(RecordAgentNudge(agent.id, notice, declaration.key), self.actors.actor("journal.core.approvals"),
                     cause_id=logged.id, environment_id=request.environment_id)
