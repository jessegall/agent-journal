from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.settings.commands.set_setting.set_setting import SetSetting
from core.modules.voices.commands.set_voice_address.set_voice_address import SetVoiceAddress
from core.modules.voices.support.voice_choice import VoiceChoice
from core.modules.voices.support.voices_settings import NAME_KEY, TITLE_KEY


class SetVoiceAddressHandler(Handler[SetVoiceAddress, str]):
    """Sets the given title and name as settings of the project, and answers how the voice calls the user."""

    command = SetVoiceAddress

    def __init__(self, bus: Bus, choice: VoiceChoice) -> None:
        self.bus, self.choice = bus, choice

    def handle(self, command: SetVoiceAddress, context: Context) -> str:
        for key, text in ((TITLE_KEY, command.title), (NAME_KEY, command.name)):
            if text is not None:
                self.bus.dispatch(SetSetting(key, text, True), context)
        return self.choice.called()
