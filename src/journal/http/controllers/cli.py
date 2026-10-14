from journal.console.console import Console
from journal.console.where import Where
from journal.http.request import Request
from journal.http.response import Response
from journal.repositories.agents import Agents
from journal.repositories.environments import Environments


class CliController:
    """The shim posts an argv here; the server runs it on the console it already has loaded and answers with the outcome."""

    def __init__(self, console: Console, agents: Agents, environments: Environments) -> None:
        self.console, self.agents, self.environments = console, agents, environments

    def run(self, request: Request) -> Response:
        environment = request.body.get("env", "main")
        session = request.body.get("session", "")
        if not session and request.body.get("agent"):
            live = self.agents.live(self.environments.named(environment).id)
            session = live.session if live else ""
        where = Where(environment, session)
        return Response.json(self.console.run(request.body.get("argv", []), where))
