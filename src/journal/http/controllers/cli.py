from journal.console.console import Console
from journal.support.where import Where
from journal.features.plugins.plugin_tokens import PluginTokens
from journal.http.support.request import Request
from journal.support.response import Response


class CliController:
    """The shim posts an argv here; the server runs it on the console it already has loaded and answers with the outcome."""

    def __init__(self, console: Console, tokens: PluginTokens) -> None:
        self.console, self.tokens = console, tokens

    def run(self, request: Request) -> Response:
        plugin = request.body.get("plugin", "")
        if plugin and not self.tokens.holds(plugin, request.body.get("token", "")):
            return Response.json({"out": "", "err": f"the journal does not know this token for plugin {plugin}\n", "code": 1}, 403)
        where = Where(request.body.get("env", "main"), request.body.get("session", ""), bool(request.body.get("agent")), plugin)
        return Response.json(self.console.run(request.body.get("argv", []), where))
