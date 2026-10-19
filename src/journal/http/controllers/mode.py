from journal.features.workers.feature import Workers
from journal.http.request import Request
from journal.http.response import Response
from journal.refused import Refused
from journal.repositories.settings import Settings


class ModeController:
    """The work mode the plan bar's Builder, Orchestrator and Solo buttons show and set: how the agent shares its work with workers."""

    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def show(self, request: Request) -> Response:
        return Response.json({"mode": self.settings.option(Workers.MODE), "modes": list(Workers.MODE.choices)})

    def choose(self, request: Request) -> Response:
        mode = request.body.get("mode")
        if mode not in Workers.MODE.choices:
            raise Refused(f"no such mode: {mode}; the modes are {', '.join(Workers.MODE.choices)}")
        self.settings.set(Workers.MODE.key, mode, request.actor)
        return self.show(request)
