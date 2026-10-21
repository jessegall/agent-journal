from journal.features.voices.support.address_form import AddressForm
from journal.features.voices.support.voice_choice import VoiceChoice
from journal.features.voices.feature import Voices
from journal.support.builtin_catalogue import HISTORICAL, KNIGHTLY, PLAIN, SPORTING, STREET, BuiltinCatalogue
from journal.http.support.request import Request
from journal.support.response import Response
from journal.support.rejection import Rejection
from journal.repositories.setting_rows import SettingRows

NAMINGS = (("Historical figures", HISTORICAL), ("Street nicknames", STREET), ("First name and role", PLAIN), ("Sporting names", SPORTING), ("Knights of the realm", KNIGHTLY))


class VoiceController:
    """The voices the agent can talk in, each with a sample in the words it would call the user by, the one chosen, and the choice written back."""

    def __init__(self, chosen: VoiceChoice, settings: SettingRows) -> None:
        self.chosen, self.settings = chosen, settings

    def index(self, request: Request) -> Response:
        title, name, chosen = self.chosen.title(), self.chosen.first_name(), self.chosen.voice().name
        voices = [{"name": v.name, "text": v.text, "calling": v.calling.value, "sample": v.sample.replace("{you}", v.calling.called(title, name, v.address) or "you"),
                   "humour": v.humour, "naming": v.naming, "address": v.address, "emoji": v.emoji, "chosen": v.name == chosen} for v in BuiltinCatalogue.ALL]
        callings = {c.value: c.called(title, name) for c in AddressForm if c is not AddressForm.AGENT_CHOICE}
        return Response.json({"voices": voices, "callings": callings, "namings": [{"label": label, "text": text} for label, text in NAMINGS]})

    def choose(self, request: Request) -> Response:
        name = str(request.body.get("name", ""))
        if name not in {v.name for v in BuiltinCatalogue.ALL}:
            raise Rejection(f"no voice is named {name!r}; the voices are {', '.join(v.name for v in BuiltinCatalogue.ALL)}")
        self.settings.set(Voices.PROFILE.key, name, request.actor)
        return self.index(request)
