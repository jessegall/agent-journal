from journal.console.console import Console
from journal.support.caller import Caller
from journal.support.plugin_tokens import PluginTokens
from journal.http.support.subagent_commands import REFUSAL, SubagentCommands
from journal.console.support.outcome import Outcome
from journal.http.support.request import Request
from journal.support.response import Response

ACTOR_HEADER = "x-journal-actor"
THREAD_HEADER = "x-journal-thread"


class CliController:
    """The shim posts an argv here; the server runs it on the console it already has loaded and answers with the outcome."""

    def __init__(self, console: Console, tokens: PluginTokens, subagents: SubagentCommands) -> None:
        self.console, self.tokens, self.subagents = console, tokens, subagents

    def run(self, request: Request) -> Response:
        plugin = request.body.get("plugin", "")
        if plugin and not self.tokens.matches(plugin, request.body.get("token", "")):
            return Response.json({"text": "", "error": f"the journal does not know this token for plugin {plugin}\n", "code": 1}, 403)
        caller = Caller(request.body.get("env", "main"), request.body.get("session", ""), bool(request.body.get("agent")), plugin)
        argv = request.body.get("argv", [])
        if self.subagents.runs(caller.environment, argv, request.headers.get(ACTOR_HEADER, ""), request.headers.get(THREAD_HEADER, "")):
            return Response.json(Outcome.refused(REFUSAL))
        return Response.json(self.console.run(argv, caller))
