from core.base.change.change import Change
from core.base.model.model import Model
from core.modules.drivers.support.nudger import Nudger
from core.modules.voices.support.voice_choice import VoiceChoice

SOURCE = "voices.voice"


class VoiceLines:
    """Saves the line that tells a main agent the voice it talks to the user in, when the user has switched on talking
    in the voice; the agent is handed it with its next hook."""

    def __init__(self, nudger: Nudger, choice: VoiceChoice) -> None:
        self.nudger, self.choice = nudger, choice

    def tell(self, agent_id: int, template: str, change: Change[Model]) -> None:
        if self.choice.speaks():
            self.nudger.send_text(agent_id, template.format(voice=self.choice.instruction()), SOURCE, change.context)
