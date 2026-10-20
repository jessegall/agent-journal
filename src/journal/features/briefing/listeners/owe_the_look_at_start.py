from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.session_started import SessionStarted
from journal.events.agent_listener import AgentListener
from journal.support.decision import Decision
from journal.support.actor import Actor
from journal.repositories.agents import Agents


class OweTheLookAtStart(AgentListener[SessionStarted]):
    """Every start of a session owes a look at what is in flight here before any other write: the fact on the agent's row, and the line that says so."""

    blocking = True

    def __init__(self, machine: Machine, nudger: Nudger, agents: Agents) -> None:
        self.machine, self.nudger, self.agents = machine, nudger, agents

    def handle(self, event: SessionStarted) -> Decision | None:
        from journal.features.briefing.feature import Briefing
        agent = self.agents.touch(self.machine.agent(event.session, event.environment_id), Actor.system(), oriented=False)
        line = self.nudger.say(agent, Briefing.LOOK_BEFORE_THE_FIRST_WRITE.create())
        return Decision.tell(line) if line else None
