from core.base.agent_roster import AgentRoster
from core.modules.agents.models.agent import Agent


class WorkerRoster(AgentRoster[Agent]):
    """Lists the workers available to hold work."""

    def available(self, environment_id: int) -> tuple[Agent, ...]:
        return ()
