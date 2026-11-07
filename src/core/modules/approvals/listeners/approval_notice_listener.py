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
from core.modules.approvals.support.approval_nudges import APPROVAL_PENDING, APPROVAL_DECIDED
from core.modules.drivers.commands.record_agent_notice.record_agent_notice import RecordAgentNotice


class ApprovalNoticeListener(CommitListener[Changed[ApprovalRequest]]):
    """Tells the requesting agent when a person was asked and when the request ends."""

    name = "approvals.notices"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries) -> None:
        self.bus, self.actors, self.queries = bus, actors, queries

    def handle(self, event: Changed[ApprovalRequest], logged: LoggedEvent) -> None:
        request = event.row
        created = isinstance(event, Created)
        if not created and request.state not in (ApprovalState.ACCEPTED, ApprovalState.REFUSED, ApprovalState.CLOSED):
            return
        agent = self.queries.query(Agent).filter(id=request.requester_id).first()
        if agent is None:
            return
        declaration = APPROVAL_PENDING if created else APPROVAL_DECIDED
        notice = declaration.nudge(approval=request.id)
        self.bus.run(RecordAgentNotice(agent.id, notice.text, declaration.key), self.actors.actor("journal.core.approvals"),
                     cause_id=logged.id, environment_id=request.environment_id)
