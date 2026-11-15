from engine.driver.hook_event import HookEvent
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.drivers.conditions.agent_family import AgentFamily
from core.modules.drivers.models.agent_activity import AgentActivity

OPEN_FAMILY_REASON = "The open agents of one family, which the agent limits bound; every rule of the hook reads them from this one load."


class AgentActivities:
    """The activity rows of an agent and of the open agents of its family, shared by all rules evaluating one hook."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries
        self.event: HookEvent | None = None
        self.agent_id = 0
        self.rows: dict[int, AgentActivity] = {}

    # kept for one hook event of one agent; the minute step, which has no event, reads them anew
    def read(self, event: HookEvent | None, agent_id: int) -> dict[int, AgentActivity]:
        if event is None or self.event is not event or self.agent_id != agent_id:
            self.rows = {row.id: row for row in self.queries.query(AgentActivity).matching(AgentFamily(agent_id)).matching(IsNull("ended_at")).every_row(OPEN_FAMILY_REASON)}
            self.event, self.agent_id = event, agent_id
        return self.rows
