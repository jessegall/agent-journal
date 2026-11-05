from core.base.driver.agent_hook import AgentHook
from core.modules.memories.queries.active_memory_query import ActiveMemoryQuery


class HookMemories:
    """The active memories a hook's agent may be given."""

    def __init__(self, active: ActiveMemoryQuery) -> None:
        self.active = active

    def query(self, hook: AgentHook) -> ActiveMemoryQuery:
        return self.agent_query(hook.agent_id, hook.environment_id)

    def agent_query(self, agent_id: int, environment_id: int) -> ActiveMemoryQuery:
        return self.active.scope(agent_id, environment_id)
