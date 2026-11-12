from engine.driver.agent_hook import AgentHook
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
        self.rows: dict[int, AgentActivity] = {}

    def read(self, hook: AgentHook) -> dict[int, AgentActivity]:
        if self.event is not hook.event:
            self.rows = {row.id: row for row in self.queries.query(AgentActivity).matching(AgentFamily(hook.agent_id)).matching(IsNull("ended_at")).full_table(OPEN_FAMILY_REASON).all_rows()}
            self.event = hook.event
        return self.rows
