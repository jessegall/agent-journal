from journal.features.voices.calling import Calling
from journal.features.voices.chosen_voice import ChosenVoice
from journal.features.voices.feature import Voices
from journal.features.voices.shipped import HISTORICAL, KNIGHTLY, PLAIN, SPORTING, STREET, Shipped
from journal.http.request import Request
from journal.http.response import Response
from journal.refused import Refused
from journal.repositories.settings import Settings

NAMINGS = (("Historical figures", HISTORICAL), ("Street nicknames", STREET), ("First name and role", PLAIN), ("Sporting names", SPORTING), ("Knights of the realm", KNIGHTLY))


class VoiceController:
    """The voices the agent can talk in, each with a sample in the words it would call the user by, the one chosen, and the choice written back."""

    def __init__(self, chosen: ChosenVoice, settings: Settings) -> None:
        self.chosen, self.settings = chosen, settings

    def index(self, request: Request) -> Response:
        title, name, chosen = self.chosen.title(), self.chosen.first_name(), self.chosen.voice().name
        voices = [{"name": v.name, "text": v.text, "calling": v.calling.value, "sample": v.sample.replace("{you}", v.calling.called(title, name, v.address) or "you"),
                   "humour": v.humour, "naming": v.naming, "address": v.address, "emoji": v.emoji, "chosen": v.name == chosen} for v in Shipped.ALL]
        callings = {c.value: c.called(title, name) for c in Calling if c is not Calling.OWN}
        return Response.json({"voices": voices, "callings": callings, "namings": [{"label": label, "text": text} for label, text in NAMINGS]})

    def choose(self, request: Request) -> Response:
        name = str(request.body.get("name", ""))
        if name not in {v.name for v in Shipped.ALL}:
            raise Refused(f"no voice is named {name!r}; the voices are {', '.join(v.name for v in Shipped.ALL)}")
        self.settings.set(Voices.PROFILE.key, name, request.actor)
        return self.index(request)
