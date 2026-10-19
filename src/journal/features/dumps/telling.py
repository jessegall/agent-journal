from journal.engine.nudger import Nudger
from journal.engine.said import Said
from journal.repositories.agents import Agents
from journal.supervisor_link import SupervisorLink


class Telling:
    """Says a line about a dump to the live agent here, typed into its terminal."""

    def __init__(self, nudger: Nudger, agents: Agents, supervisor: SupervisorLink) -> None:
        self.nudger, self.agents, self.supervisor = nudger, agents, supervisor

    def tell(self, said: Said) -> None:
        agent = self.agents.live()
        line = agent and self.nudger.say(agent, said)
        if line:
            self.supervisor.type(agent.environment_id, line)
