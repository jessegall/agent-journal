import re

from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.turn_written import TurnWritten
from journal.events.agent_listener import AgentListener
from journal.supervisor_link import SupervisorLink

SHOP_TALK = re.compile(r"\bjournal (task|plan|message|question|fact|rule|reminder|sequence|worker|check|skill|stuck|nothing) [a-z]+\b|\[journal\]", re.I)
THIRD_PERSON = re.compile(r"\bthe user\b", re.I)
EM_DASHES = re.compile(r"—.*—", re.S)
RUN_ON, SENTENCES = 400, 3


class ReadTurn(AgentListener[TurnWritten]):
    """Every turn for the user is read once: talk about the work, not the journal's commands, and say you, never the user."""

    def __init__(self, machine: Machine, nudger: Nudger, supervisor: SupervisorLink) -> None:
        self.machine, self.nudger, self.supervisor = machine, nudger, supervisor

    def handle(self, event: TurnWritten) -> None:
        from journal.features.etiquette.feature import Etiquette
        if not event.final:
            return
        agent = self.machine.agent(event.session, event.environment_id)
        for pattern, said in ((SHOP_TALK, Etiquette.SHOP_TALK), (THIRD_PERSON, Etiquette.THIRD_PERSON), (EM_DASHES, Etiquette.DASHES)):
            if pattern.search(event.text) and (line := self.nudger.say(agent, said.about())):
                self.supervisor.type(event.environment_id, line)
        if self.run_together(event.text) and (line := self.nudger.say(agent, Etiquette.PARAGRAPHS.about())):
            self.supervisor.type(event.environment_id, line)

    @staticmethod
    def run_together(text: str) -> bool:
        """A long turn of several sentences with no blank line in it."""
        text = text.strip()
        return len(text) >= RUN_ON and "\n\n" not in text and text.count(". ") >= SENTENCES
