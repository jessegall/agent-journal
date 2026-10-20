from journal.engine.nudger import Nudger
from journal.engine.nudge import Nudge
from journal.models.agent import Agent
from journal.repositories.agents import Agents
from journal.supervisor_link import SupervisorLink


class Telling:
    """Says a line to the live agent here, typed into its terminal: a line about a row the agent did not touch, such as a dump arriving or a wait cleared."""

    def __init__(self, nudger: Nudger, agents: Agents, supervisor: SupervisorLink) -> None:
        self.nudger, self.agents, self.supervisor = nudger, agents, supervisor

    def tell(self, said: Nudge) -> None:
        agent = self.agents.live()
        if agent is not None:
            self.tell_to(agent, said)

    def tell_to(self, agent: Agent, said: Nudge) -> None:
        line = self.nudger.say(agent, said)
        if line:
            self.supervisor.type(agent.environment_id, line)
