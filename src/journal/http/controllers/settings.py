from journal.features.registry import Registry
from journal.features.voices.chosen_voice import ChosenVoice
from journal.features.voices.shipped import Shipped
from journal.http.request import Request
from journal.http.response import Response
from journal.repositories.settings import Settings


class SettingController:
    """Every feature with its switch and help, and the switch written back at the project's scope."""

    def __init__(self, settings: Settings, registry: Registry, chosen: ChosenVoice) -> None:
        self.settings, self.registry, self.chosen = settings, registry, chosen

    def index(self, request: Request) -> Response:
        return Response.json([{"name": f.name, "title": f.title, "help": f.help, "on": self.registry.is_on(f), "nudges": [n.title for n in f.nudges], "states": [s.name for s in f.states]} for f in self.registry.features])

    def values(self, request: Request) -> Response:
        """Every setting as the environment sees it, project values laid over."""
        return Response.json(self.settings.merged())

    def voice(self, request: Request) -> Response:
        return Response.json({"chosen": self.chosen.voice().name, "title": self.chosen.title(), "name": self.chosen.first_name(),
                              "voices": [{"name": v.name, "sample": v.sample.replace("{you}", v.calling.called(self.chosen.title(), self.chosen.first_name(), v.address) or "you")} for v in Shipped.ALL]})

    def store(self, request: Request) -> Response:
        key, value = request.body.get("key", ""), request.body.get("value")
        return Response.json(self.settings.set(key, value, request.actor))
