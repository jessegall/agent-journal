import re

from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.turn_written import TurnWritten
from journal.features.agent_listener import AgentListener
from journal.supervisor_link import SupervisorLink

SHOP_TALK = re.compile(r"\bjournal (task|plan|message|question|fact|rule|reminder|sequence|worker|check|skill|halt|nothing)\b|\[journal\]", re.I)
THIRD_PERSON = re.compile(r"\bthe user\b", re.I)


class ReadTurn(AgentListener[TurnWritten]):
    """Every turn for the user is read once: talk about the work, not the journal's commands, and say you, never the user."""

    def __init__(self, machine: Machine, nudger: Nudger, supervisor: SupervisorLink) -> None:
        self.machine, self.nudger, self.supervisor = machine, nudger, supervisor

    def handle(self, event: TurnWritten) -> None:
        from journal.features.etiquette.feature import Etiquette
        agent = self.machine.agent(event.session, event.environment_id)
        for pattern, said in ((SHOP_TALK, Etiquette.SHOP_TALK), (THIRD_PERSON, Etiquette.THIRD_PERSON)):
            if pattern.search(event.text) and (line := self.nudger.say(agent, said.about())):
                self.supervisor.type(line)
