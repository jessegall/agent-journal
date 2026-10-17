from journal.features.sequences.running import Running
from journal.models.actor import Actor
from journal.models.agent import Agent
from journal.refused import Refused
from journal.repositories.agents import Agents
from journal.supervisor_link import SupervisorLink


class AgentActions:
    """What the agent's panel does to the sequence the agent is running: skip the step in hand, or end the run; the agent is typed what changed."""

    def __init__(self, agents: Agents, running: Running, supervisor: SupervisorLink) -> None:
        self.agents, self.running, self.supervisor = agents, running, supervisor

    def skip_step(self, n: int, body: dict, by: Actor) -> Agent:
        agent = self.running_agent(n)
        self.told(agent, self.running.skip(agent.session, agent.environment_id))
        return self.agents.find(n)

    def end_sequence(self, n: int, body: dict, by: Actor) -> Agent:
        agent = self.running_agent(n)
        self.told(agent, self.running.end(agent.session, agent.environment_id))
        return self.agents.find(n)

    def running_agent(self, n: int) -> Agent:
        agent = self.agents.find(n)
        if self.running.in_hand(agent.session, agent.environment_id) is None:
            raise Refused(f"agent {n} runs no sequence")
        return agent

    def told(self, agent: Agent, line: str) -> None:
        if self.running.typed_to(agent.session, agent.environment_id):
            self.supervisor.type(agent.environment_id, line)
