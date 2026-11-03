from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.settings.commands.set_setting.set_setting import SetSetting
from core.modules.voices.commands.voice_address.address_voice import AddressVoice
from core.modules.voices.support.voice_choice import VoiceChoice
from core.modules.voices.support.voices_settings import NAME_KEY, TITLE_KEY


class AddressVoiceHandler(Handler[AddressVoice, str]):
    """Sets the given title and name as settings of the project, and answers how the voice calls the user."""

    command = AddressVoice

    def __init__(self, bus: Bus, choice: VoiceChoice) -> None:
        self.bus, self.choice = bus, choice

    def handle(self, command: AddressVoice, context: Context) -> str:
        for key, text in ((TITLE_KEY, command.title), (NAME_KEY, command.name)):
            if text is not None:
                self.bus.dispatch(SetSetting(key, text, True), context)
        return self.choice.called()
