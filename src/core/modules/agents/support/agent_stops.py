from core.modules.agents.models.agent import Agent


class AgentStops:
    """Whether an agent that ended is gone for good, so a report to it goes to the running main agent; a suite whose
    agents come back says so by its own binding."""

    def is_final(self, agent: Agent) -> bool:
        return agent.ended_at is not None
