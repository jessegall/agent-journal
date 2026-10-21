from dataclasses import replace

from journal.console.console import Console
from journal.support.caller_variables import CallerVariables
from journal.providers.providers import Providers
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

    def __init__(self, console: Console, tokens: PluginTokens, subagents: SubagentCommands, launches: LaunchFiles, providers: Providers) -> None:
        self.console, self.tokens, self.subagents, self.launches, self.providers = console, tokens, subagents, launches, providers

    def run(self, request: Request) -> Response:
        variables = CallerVariables.parsed(request.body, self.providers.default().name)
        if variables.plugin is not None and not self.tokens.matches(variables.plugin, variables.token):
            return Response.json({"text": "", "error": f"the journal does not know this token for plugin {variables.plugin}\n", "code": 1}, 403)
        caller = (variables if self.launches.is_launch(variables.environment, variables.launch) else replace(variables, agent_shell=False)).caller()
        argv = request.body["argv"]
        if self.subagents.runs(caller.environment, argv, request.headers.get(ACTOR_HEADER, ""), request.headers.get(THREAD_HEADER, "")):
            return Response.json(Outcome.refused(REFUSAL))
        return Response.json(self.console.run(argv, caller))
