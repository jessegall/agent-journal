from events import Fact
from events.form_of_address import VoiceChanged
from features.form_of_address.details import VOICE_SET
from receiving import Handler
from resources.types import Profile
from serving import Chat, ReadRows


class TellVoiceChanged(Handler[VoiceChanged]):
    def handle(self, event: VoiceChanged, chat: Chat, profiles: ReadRows[Profile]) -> list[Fact]:
        chat.say(VOICE_SET, voice=profiles.how_to_talk())
        return []
