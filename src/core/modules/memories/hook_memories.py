from core.base.driver.agent_hook import AgentHook
from core.modules.memories.memory_type_choice import MemoryTypeChoice
from core.modules.memories.standing_memory_query import StandingMemoryQuery


class HookMemories:
    """The standing memories a hook's agent may be given: its scope's and the project's, of the types switched on
    in its environment."""

    def __init__(self, standing: StandingMemoryQuery, choice: MemoryTypeChoice) -> None:
        self.standing, self.choice = standing, choice

    def query(self, hook: AgentHook) -> StandingMemoryQuery:
        return self.standing.scope(hook.agent_id, hook.environment_id).types(self.choice.enabled_types(hook.environment_id))
