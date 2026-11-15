from engine.command.context import Context
from engine.driver.message_sender import MessageSender
from core.modules.voices.support.voice_choice import VoiceChoice

SOURCE = "voices.voice"


class VoiceLines:
    """Saves the line that tells a main agent the voice it talks to the user in, when the user has switched on
    talking in the voice; the agent is handed it with its next hook."""

    def __init__(self, message_sender: MessageSender, choice: VoiceChoice) -> None:
        self.message_sender, self.choice = message_sender, choice

    def deliver(self, agent_id: int, template: str, context: Context) -> None:
        if self.choice.is_voiced():
            self.message_sender.send_text(agent_id, template.format(voice=self.choice.instruction()), SOURCE, context)
