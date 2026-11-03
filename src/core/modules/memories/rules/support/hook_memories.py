from core.base.driver.agent_hook import AgentHook
from core.modules.memories.support.memory_type_choice import MemoryTypeChoice
from core.modules.memories.queries.active_memory_query import ActiveMemoryQuery


class HookMemories:
    """The active memories a hook's agent may be given: its scope's and the project's, of the types
    switched on in its environment."""

    def __init__(self, active: ActiveMemoryQuery, choice: MemoryTypeChoice) -> None:
        self.active, self.choice = active, choice

    def query(self, hook: AgentHook) -> ActiveMemoryQuery:
        return self.agent_query(hook.agent_id, hook.environment_id)

    def agent_query(self, agent_id: int, environment_id: int) -> ActiveMemoryQuery:
        return self.active.scope(agent_id, environment_id).types(self.choice.enabled_types(environment_id))
