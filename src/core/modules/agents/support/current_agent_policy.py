from core.base.agent_policy import AgentPolicy


class CurrentAgentPolicy:
    """The agent policy of the environment's suite; answered by the module that chooses the suite, and the default
    policy without one."""

    def agent_policy(self) -> AgentPolicy:
        return AgentPolicy()
