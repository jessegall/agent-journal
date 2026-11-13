from engine.process.door.placed_run import PlacedRun
from engine.process.door.run_pauses import RunPauses
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows


class AgentRunPauses(RunPauses):
    """A run is paused while the agent it works for is paused, the running main agent of its environment for a run of
    a main agent; a run of no agent, such as one of a user or of the journal itself, never is."""

    def __init__(self, agents: AgentRows) -> None:
        self.agents = agents

    def is_paused(self, run: PlacedRun) -> bool:
        return any(agent.is_paused for agent in self.owners(run))

    def owners(self, run: PlacedRun) -> tuple[Agent, ...]:
        if run.agent_id is not None:
            return tuple([self.agents.find_unscoped(run.agent_id)])
        main = self.agents.environment_main_agent(run.environment_id) if run.is_main_agent and run.environment_id is not None else None
        return () if main is None else tuple([main])
