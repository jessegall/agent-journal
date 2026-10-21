from datetime import datetime, timezone

from journal.features.pausing.states.user_pause import UserPause
from journal.models.agent import Agent
from journal.repositories.agents import Agents
from journal.support.actor import Actor
from journal.support.rejection import Rejection


class AgentPause:
    """The user's pause of an agent, written on its row: the pause pushes PausedByUser, whose hold stops the agent's next tool call, and the resume pops it and tells the agent to carry on. The row comes back as the state machine left it."""

    def __init__(self, agents: Agents) -> None:
        self.agents = agents

    def pause(self, agent: Agent, actor: Actor) -> Agent:
        if agent.state == UserPause.name:
            return agent
        self.agents.save(agent.user_paused(datetime.now(timezone.utc).timestamp()), actor)
        return self.agents.find(agent.row_id)

    def resume(self, agent: Agent, actor: Actor) -> Agent:
        if agent.state != UserPause.name:
            raise Rejection(f"agent {agent.id} is not paused")
        self.agents.save(agent.user_resumed(datetime.now(timezone.utc).timestamp()), actor)
        return self.agents.find(agent.row_id)
