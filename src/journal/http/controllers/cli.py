from journal.console.console import Console
from journal.support.caller import Caller
from journal.support.plugin_tokens import PluginTokens
from journal.http.support.subagent_commands import REFUSAL, SubagentCommands
from journal.console.support.outcome import Outcome
from journal.http.support.request import Request
from journal.support.response import Response
from journal.engine.support.launch_files import LaunchFiles

ACTOR_HEADER = "x-journal-actor"
THREAD_HEADER = "x-journal-thread"


class CliController:
    """The shim posts an argv here; the server runs it on the console it already has loaded and answers with the outcome. A command from a shell whose launch id is not its environment's is not taken as the live agent's."""

    def __init__(self, console: Console, tokens: PluginTokens, subagents: SubagentCommands, launches: LaunchFiles) -> None:
        self.console, self.tokens, self.subagents, self.launches = console, tokens, subagents, launches

    def run(self, request: Request) -> Response:
        plugin = request.body.get("plugin", "")
        if plugin and not self.tokens.matches(plugin, request.body.get("token", "")):
            return Response.json({"text": "", "error": f"the journal does not know this token for plugin {plugin}\n", "code": 1}, 403)
        environment = request.body.get("env", "main")
        agent_shell = bool(request.body.get("agent")) and self.launches.is_launch(environment, request.body.get("launch", ""))
        caller = Caller(environment, request.body.get("session", ""), agent_shell, plugin, int(request.body.get("worker") or 0))
        argv = request.body.get("argv", [])
        if self.subagents.runs(caller.environment, argv, request.headers.get(ACTOR_HEADER, ""), request.headers.get(THREAD_HEADER, "")):
            return Response.json(Outcome.refused(REFUSAL))
        return Response.json(self.console.run(argv, caller))
