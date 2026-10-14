from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.session_started import SessionStarted
from journal.features.agent_listener import AgentListener
from journal.features.voices.chosen_voice import ChosenVoice
from journal.hooks.decision import Decision


class SayVoiceAtStart(AgentListener[SessionStarted]):
    """Every session start tells the agent how to talk to the user."""

    blocking = True

    def __init__(self, machine: Machine, nudger: Nudger, chosen: ChosenVoice) -> None:
        self.machine, self.nudger, self.chosen = machine, nudger, chosen

    def handle(self, event: SessionStarted) -> Decision | None:
        from journal.features.voices.feature import Voices
        line = self.nudger.say(self.machine.agent(event.session, event.environment_id), Voices.VOICE.about(voice=self.chosen.instruction()))
        return Decision.tell(line) if line else None
