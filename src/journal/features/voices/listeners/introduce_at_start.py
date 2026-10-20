from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.journal_started import JournalStarted
from journal.events.agent_listener import AgentListener
from journal.supervisor_link import SupervisorLink

PROMPT_UP_AFTER = 4.0
"""Seconds after the start hook before Claude's prompt takes a typed line."""


class IntroduceAtStart(AgentListener[JournalStarted]):
    """When the journal has started the agent, the agent makes itself known in the chat, in its voice: an introduction in a new conversation, a word that it is back in a resumed one; the journal types the request once the prompt is up."""

    def __init__(self, machine: Machine, nudger: Nudger, supervisor: SupervisorLink) -> None:
        self.machine, self.nudger, self.supervisor = machine, nudger, supervisor

    def handle(self, event: JournalStarted) -> None:
        from journal.features.voices.feature import Voices
        said = Voices.SAY_YOU_ARE_BACK if event.source == "resume" else Voices.INTRODUCE_YOURSELF
        line = self.nudger.say(self.machine.agent(event.session, event.environment_id), said.create())
        if line:
            self.supervisor.type(event.environment_id, line, after=PROMPT_UP_AFTER)
