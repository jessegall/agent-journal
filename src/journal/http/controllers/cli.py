from journal.console.console import Console
from journal.console.where import Where
from journal.http.request import Request
from journal.http.response import Response


class CliController:
    """The shim posts an argv here; the server runs it on the console it already has loaded and answers with the outcome."""

    def __init__(self, console: Console) -> None:
        self.console = console

    def run(self, request: Request) -> Response:
        where = Where(request.body.get("env", "main"), request.body.get("session", ""), bool(request.body.get("agent")))
        return Response.json(self.console.run(request.body.get("argv", []), where))
