from engine.request.request_values import RequestValues
from engine.driver.hook_event import HookEvent
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.drivers.conditions.agent_family import AgentFamily
from core.modules.drivers.models.agent_activity import AgentActivity

OPEN_FAMILY_REASON = "The open agents of one family, which the agent limits bound; every source of the step reads them from this one load."


class AgentActivities:
    """The activity rows of an agent and of the open agents of its family, shared by every source of one step."""

    def __init__(self, queries: Queries, request_values: RequestValues) -> None:
        self.queries, self.request_values = queries, request_values
        self.event: HookEvent | None = None
        self.agent_id = 0
        self.rows: dict[int, AgentActivity] = {}

    # kept for one hook event of one agent; the minute step, which has no event, keeps them for its request
    def read(self, event: HookEvent | None, agent_id: int) -> dict[int, AgentActivity]:
        if event is None:
            return self.request_values.read(f"drivers.family-activities:{agent_id}", lambda: 0, lambda: self.family(agent_id))
        if self.event is not event or self.agent_id != agent_id:
            self.rows = self.family(agent_id)
            self.event, self.agent_id = event, agent_id
        return self.rows

    def family(self, agent_id: int) -> dict[int, AgentActivity]:
        return {row.id: row for row in self.queries.query(AgentActivity).matching(AgentFamily(agent_id)).matching(IsNull("ended_at")).every_row(OPEN_FAMILY_REASON)}
