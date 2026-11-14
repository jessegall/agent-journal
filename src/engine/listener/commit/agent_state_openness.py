from engine.driver.agent_state import AgentState


class AgentStateOpenness:
    """Whether an agent state is open for an agent outside a hook, as a state listener asks it. With no module
    answering, every state is open, so a state listener runs as an ungated one."""

    def is_open(self, agent_id: int, state: type[AgentState]) -> bool:
        return True
