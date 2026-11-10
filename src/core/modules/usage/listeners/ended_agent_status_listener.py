from core.modules.agents.events.agent_ended import AgentEnded
from engine.change.logged_event import LoggedEvent
from engine.listener.commit_listener import CommitListener
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent, ENDED_FIELD
from core.modules.usage.support.status_files import StatusFiles


class EndedAgentStatusListener(CommitListener[AgentEnded]):
    """When an agent ends, the status file of its session is removed, so usage reads only the files of open
    sessions; the plan's windows it named stay in plan.json."""

    name = "usage.ended-agent-status"

    def __init__(self, queries: Queries, files: StatusFiles) -> None:
        self.queries, self.files = queries, files

    def handle(self, event: AgentEnded, logged: LoggedEvent) -> None:
        session = event.row.session
        if not self.queries.query(Agent).filter(session=session).matching(IsNull(ENDED_FIELD)).exists():
            self.files.retire(session)
