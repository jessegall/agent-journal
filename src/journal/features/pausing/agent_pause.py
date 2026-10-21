from datetime import datetime, timezone

from journal.features.pausing.states.paused_by_user import PausedByUser
from journal.models.agent import Agent
from journal.repositories.agents import Agents
from journal.support.actor import Actor
from journal.support.refused import Refused


class AgentPause:
    """The user's pause of an agent, written on its row: the pause pushes PausedByUser, whose hold stops the agent's next tool call, and the resume pops it and tells the agent to carry on. The row comes back as the state machine left it."""

    def __init__(self, agents: Agents) -> None:
        self.agents = agents

    def pause(self, agent: Agent, actor: Actor) -> Agent:
        if agent.state == PausedByUser.name:
            return agent
        self.agents.save(agent.paused_by_user(datetime.now(timezone.utc).timestamp()), actor)
        return self.agents.find(agent.id)

    def resume(self, agent: Agent, actor: Actor) -> Agent:
        if agent.state != PausedByUser.name:
            raise Refused(f"agent {agent.id} is not paused")
        self.agents.save(agent.resumed_by_user(datetime.now(timezone.utc).timestamp()), actor)
        return self.agents.find(agent.id)
