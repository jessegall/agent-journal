from engine.agent.agent_policy import AgentPolicy
from core.modules.agents.support.current_agent_policy import CurrentAgentPolicy
from core.modules.drivers.support.suite_choice import SuiteChoice


class SuiteAgentPolicy(CurrentAgentPolicy):
    """Reads the agent policy of the suite the environment chose."""

    def __init__(self, suites: SuiteChoice) -> None:
        self.suites = suites

    def agent_policy(self) -> AgentPolicy:
        return self.suites.agent_policy()
