from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent, ENDED_FIELD
from core.modules.usage.support.status_files import StatusFiles


class EndedAgentStatusListener(CommitListener):
    """When an agent ends, the status file of its session is removed, so usage reads only the files of open
    sessions; the plan's windows it named stay in plan.json."""

    name = "usage.ended-agent-status"
    event = "agent.*"

    def __init__(self, queries: Queries, files: StatusFiles) -> None:
        self.queries, self.files = queries, files

    def handle(self, event: LoggedEvent) -> None:
        if ENDED_FIELD not in event.data or event.data[ENDED_FIELD][1] is None:
            return
        session = self.queries.query(Agent).find(event.row_id).session
        if not self.queries.query(Agent).filter(session=session).matching(IsNull(ENDED_FIELD)).exists():
            self.files.retire(session)
