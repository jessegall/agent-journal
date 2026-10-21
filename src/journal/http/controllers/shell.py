from dataclasses import replace

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

    def __init__(self, runner: ShellRunner, scope: Scope, providers: Providers, identity: WorkerIdentity) -> None:
        self.runner, self.scope, self.providers, self.identity = runner, scope, providers, identity

    def run(self, request: Request) -> StreamResponse:
        posted = ShellRequest.parse(request.body["raw"], request.headers.get(CWD_HEADER, ""), request.headers.get(SHELL_HEADER, ""))
        variables = replace(self.providers.caller_variables(posted.environment), environment=request.environment)
        if not self.identity.is_proven(variables):
            return StreamResponse("text/plain", iter([f"{REFUSAL}{EXIT} 1\n".encode()]))
        return StreamResponse("text/plain", self.runner.run(posted, variables.caller(), self.scope.id))
