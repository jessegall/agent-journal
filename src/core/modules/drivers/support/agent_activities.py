from core.base.driver.agent_hook import AgentHook
from core.base.driver.hook_event import HookEvent
from core.base.query.queries import Queries
from core.modules.drivers.conditions.agent_family import AgentFamily
from core.modules.drivers.models.agent_activity import AgentActivity


class AgentActivities:
    """Activity rows shared by all rules evaluating one hook."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries
        self.event: HookEvent | None = None
        self.rows: dict[int, AgentActivity] = {}

    def read(self, hook: AgentHook) -> dict[int, AgentActivity]:
        if self.event is not hook.event:
            self.rows = {row.id: row for row in self.queries.query(AgentActivity).matching(AgentFamily(hook.agent_id)).all_rows()}
            self.event = hook.event
        return self.rows
