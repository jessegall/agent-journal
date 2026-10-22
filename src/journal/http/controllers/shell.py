from dataclasses import replace

from journal.support.announced_commands import AnnouncedCommands
from journal.support.caller import Caller
from journal.support.caller_variables import CallerVariables
from journal.support.chain import Chain
from journal.features.shell.support.shell_request import ShellRequest
from journal.features.shell.support.shell_runner import EXIT, ShellRunner
from journal.features.workers.support.worker_identity import REFUSAL, WorkerIdentity
from journal.http.support.request import Request
from journal.http.support.stream_response import StreamResponse
from journal.repositories.scope import Scope
from journal.providers.providers import Providers

CWD_HEADER = "x-journal-cwd"
SHELL_HEADER = "x-journal-shell"


class ShellController:
    """The shim posts a shell line here with the folder, the shell and the environment it runs in; the runner streams back what the agent sees, the exit code last."""

    def __init__(self, runner: ShellRunner, scope: Scope, providers: Providers, identity: WorkerIdentity, announced: AnnouncedCommands) -> None:
        self.runner, self.scope, self.providers, self.identity, self.announced = runner, scope, providers, identity, announced

    def run(self, request: Request) -> StreamResponse:
        posted = ShellRequest.parse(request.body["raw"], request.headers.get(CWD_HEADER, ""), request.headers.get(SHELL_HEADER, ""))
        variables = replace(self.providers.caller_variables(posted.environment), environment=request.environment)
        if not self.identity.is_proven(variables):
            return StreamResponse("text/plain", iter([f"{REFUSAL}{EXIT} 1\n".encode()]))
        return StreamResponse("text/plain", self.runner.run(posted, self.caller(variables, posted.line), self.scope.id))

    def caller(self, variables: CallerVariables, line: str) -> Caller:
        caller = variables.caller()
        return caller.subagent_caller() if self.announced.is_announced(variables.environment, caller.session, tuple(Chain.self_parts(line))) else caller
