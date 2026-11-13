from typing import TextIO
from engine.cli.line_run import LineRun, ignore_completed
from collections.abc import Callable
from engine.container.container import Container
from engine.request.request_queue import RequestQueue
from engine.database.reported_findings import ReportedFindings
from engine.journal.journal_home import JournalHome
from engine.listener.commit.commit_listener_runner import CommitListenerRunner
from server.endpoints.cli_request import CliRequest
from server.work.request_limits import CLI_LIMIT_SECONDS
from engine.database.write_turns import WriteTurns



class CliEndpoint:
    """Answers POST /cli: runs the command line as the caller the request names, as a direct run would,
    waiting for another writer up to the /cli limit, and streams what it prints."""

    def __init__(self, home: JournalHome, listener_runner: CommitListenerRunner, reported: ReportedFindings, request_queue: RequestQueue | None = None, completion_callback: Callable[[Container, list[str]], None] = ignore_completed,
                 turns: WriteTurns | None = None) -> None:
        self.line_run = LineRun(home, CLI_LIMIT_SECONDS, listener_runner, reported, request_queue, completion_callback, turns)

    def answer(self, request: CliRequest, stream: TextIO) -> int:
        return self.line_run.run(request.argv, request.caller, stream, request.deadline, request.timing)
