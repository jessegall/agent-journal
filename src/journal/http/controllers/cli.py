from dataclasses import replace

from journal.console.command import HELPER_KINDS
from journal.support.caller_kind import CallerKind
from journal.models.alias import Alias
from journal.console.console import Console
from journal.features.aliases.support.alias_lines import AliasLines
from journal.support.caller import Caller
from journal.support.caller_variables import CallerVariables
from journal.features.workers.support.worker_identity import REFUSAL as WORKER_REFUSAL, WorkerIdentity
from journal.providers.providers import Providers
from journal.support.plugin_tokens import PluginTokens
from journal.http.support.subagent_commands import SubagentCommands
from journal.console.support.outcome import Outcome
from journal.http.support.cli_post import CliPost
from journal.http.support.request import Request
from journal.http.support.stream_response import StreamResponse
from journal.features.shell.support.shell_runner import EXIT
from journal.support.response import Response
from journal.engine.support.launch_files import LaunchFiles

ACTOR_HEADER = "x-journal-actor"
THREAD_HEADER = "x-journal-thread"
EXEC = "__journal_exec"


class CliController:
    """The shim posts an argv here; the server runs it on the console it already has loaded and answers with the outcome, or with the line an alias stands for, which the shim runs itself. A command from a shell whose launch id is not its environment's is not taken as the live agent's."""

    def __init__(self, console: Console, tokens: PluginTokens, subagents: SubagentCommands, launches: LaunchFiles, providers: Providers, aliases: AliasLines, identity: WorkerIdentity) -> None:
        self.console, self.tokens, self.subagents, self.launches, self.providers, self.aliases = console, tokens, subagents, launches, providers, aliases
        self.identity = identity

    def run(self, request: Request) -> Response:
        variables = CallerVariables.parsed(request.body, self.providers.default().name)
        if not self.is_known(variables):
            return Response.json(self.token_refusal(variables), 403)
        return Response.json(self.outcome(variables, request.body["argv"], request))

    def run_posted(self, request: Request) -> StreamResponse:
        posted = CliPost.parsed(request.body["raw"])
        variables = replace(self.providers.caller_variables(posted.environment), environment=request.environment)
        alias = self.aliases.called(posted.argv)
        if alias is not None and self.is_known(variables):
            return self.alias_answer(alias, posted.argv, self.caller(variables, posted.argv, request).kind)
        outcome = self.outcome(variables, posted.argv, request) if self.is_known(variables) else self.token_refusal(variables)
        text = outcome.text + outcome.error
        return StreamResponse("text/plain", iter([f"{text}{'' if not text or text.endswith(chr(10)) else chr(10)}{EXIT} {outcome.code}\n".encode()]))

    @staticmethod
    def alias_answer(alias: Alias, argv: list[str], kind: CallerKind) -> StreamResponse:
        if kind in HELPER_KINDS:
            return StreamResponse("text/plain", iter([f"a {kind} may not run the alias journal {argv[0]}: an alias is the main agent's own shell line\n{EXIT} 1\n".encode()]))
        return StreamResponse("text/plain", iter([f"{EXEC} {alias.terminal_line(argv[1:])}\n{EXIT} 0\n".encode()]))

    def is_known(self, variables: CallerVariables) -> bool:
        plugin_proof = variables.plugin is None or self.tokens.matches(variables.plugin, variables.token)
        return plugin_proof and self.identity.is_proven(variables)

    def token_refusal(self, variables: CallerVariables) -> Outcome:
        if variables.plugin is not None and not self.tokens.matches(variables.plugin, variables.token):
            return Outcome.refused(f"the journal does not know this token for plugin {variables.plugin}\n")
        return Outcome.refused(WORKER_REFUSAL)

    def outcome(self, variables: CallerVariables, argv: list[str], request: Request) -> Outcome:
        return self.console.run(argv, self.caller(variables, argv, request))

    def caller(self, variables: CallerVariables, argv: list[str], request: Request) -> Caller:
        caller = (variables if self.launches.is_launch(variables.environment, variables.launch) else replace(variables, agent_shell=False)).caller()
        if self.subagents.runs(caller, argv, request.headers.get(ACTOR_HEADER), request.headers.get(THREAD_HEADER)):
            return caller.subagent_caller()
        return caller
