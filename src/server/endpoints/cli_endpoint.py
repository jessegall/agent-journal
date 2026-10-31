from typing import TextIO
from core.base.cli.line_run import LineRun
from core.base.journal_home import JournalHome
from core.base.listener.commit_listener_runner import CommitListenerRunner
from server.endpoints.cli_request import CliRequest

CLI_LIMIT_SECONDS = 600.0


class CliEndpoint:
    """Answers POST /cli: runs the command line as the caller the request names, as a direct run would, waiting
    for another writer up to the /cli limit, and streams what it prints."""

    def __init__(self, home: JournalHome, listener_runner: CommitListenerRunner) -> None:
        self.line_run = LineRun(home, CLI_LIMIT_SECONDS, listener_runner)

    def answer(self, request: CliRequest, stream: TextIO) -> int:
        return self.line_run.run(request.argv, request.caller, stream, request.deadline, request.timing)
