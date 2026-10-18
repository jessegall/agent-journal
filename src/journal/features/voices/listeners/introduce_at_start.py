from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.session_started import SessionStarted
from journal.events.agent_listener import AgentListener
from journal.supervisor_link import SupervisorLink

FRESH = "startup"
PROMPT_UP_AFTER = 4.0
"""Seconds after the start hook before Claude's prompt takes a typed line."""


class IntroduceAtStart(AgentListener[SessionStarted]):
    """A fresh conversation opens with the agent introducing itself in the chat, in its voice: the journal types the request once the prompt is up. A resumed or cleared conversation is not greeted again."""

    def __init__(self, machine: Machine, nudger: Nudger, supervisor: SupervisorLink) -> None:
        self.machine, self.nudger, self.supervisor = machine, nudger, supervisor

    def handle(self, event: SessionStarted) -> None:
        from journal.features.voices.feature import Voices
        if event.source != FRESH:
            return
        line = self.nudger.say(self.machine.agent(event.session, event.environment_id), Voices.INTRODUCE.about())
        if line:
            self.supervisor.type(event.environment_id, line, after=PROMPT_UP_AFTER)
