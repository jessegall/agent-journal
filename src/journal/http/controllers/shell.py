from journal.features.shell.support.shell_request import ShellRequest
from journal.features.shell.support.shell_runner import ShellRunner
from journal.http.support.request import Request
from journal.http.support.stream_response import StreamResponse
from journal.support.scope import Scope
from journal.support.where import Where

CWD_HEADER = "x-journal-cwd"
SHELL_HEADER = "x-journal-shell"


class ShellController:
    """The shim posts a shell line here with the folder, the shell and the environment it runs in; the runner streams back what the agent sees, the exit code last."""

    def __init__(self, runner: ShellRunner, scope: Scope) -> None:
        self.runner, self.scope = runner, scope

    def run(self, request: Request) -> StreamResponse:
        posted = ShellRequest.parse(request.body["raw"], request.headers.get(CWD_HEADER, ""), request.headers.get(SHELL_HEADER, ""))
        where = Where.from_environ(posted.environment)
        return StreamResponse("text/plain", self.runner.run(posted, Where(request.environment, where.session, where.from_agent_shell), self.scope.id))
