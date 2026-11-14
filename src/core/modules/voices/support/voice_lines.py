from engine.command.context import Context
from engine.driver.nudger import Nudger
from core.modules.voices.support.voice_choice import VoiceChoice

SOURCE = "voices.voice"


class VoiceLines:
    """Saves the line that tells a main agent the voice it talks to the user in, when the user has switched on
    talking in the voice; the agent is handed it with its next hook."""

    def __init__(self, nudger: Nudger, choice: VoiceChoice) -> None:
        self.nudger, self.choice = nudger, choice

    def deliver(self, agent_id: int, template: str, context: Context) -> None:
        if self.choice.is_voiced():
            self.nudger.send_text(agent_id, template.format(voice=self.choice.instruction()), SOURCE, context)
