import io
from collections.abc import Callable
from dataclasses import dataclass, field
from typing import TextIO

from core.base.caller.caller_request import CallerRequest
from core.base.cli.line_run import LineRun
from core.base.deadline import Deadline
from core.base.journal_home import JournalHome
from core.base.listener.commit_listener_runner import CommitListenerRunner
from core.base.timing import Timing
from core.base.type_guards import is_mapping, is_text_list


CLI_LIMIT_SECONDS = 600.0


class CliRequestError(Exception):
    """Raised when the body of a /cli request is not a command line and its caller."""


@dataclass(frozen=True)
class CliRequest:
    """One /cli request: the command line's words, what the server knows of its caller, the pid read from the
    socket rather than sent, how long the caller waits, when it says, and the request's timing."""

    argv: list[str]
    caller: CallerRequest
    deadline: Deadline | None = None
    timing: Timing = field(default_factory=Timing)

    @classmethod
    def parsed(cls, data: object, pid: int, timing: Timing) -> "CliRequest":
        if not is_mapping(data):
            raise CliRequestError("a /cli request is an object with argv, variables and folder")
        argv = data.get("argv")
        if not is_text_list(argv):
            raise CliRequestError("argv is the list of the command line's words")
        deadline_seconds = data.get("deadline_seconds")
        if deadline_seconds is not None and not isinstance(deadline_seconds, (int, float)):
            raise CliRequestError("deadline_seconds is a number of seconds")
        caller = CallerRequest.parsed({"variables": data.get("variables", {}), "folder": data.get("folder", ""), "pid": pid})
        return cls(argv, caller, Deadline.timeout(deadline_seconds) if deadline_seconds is not None else None, timing)


class ChunkStream(io.StringIO):
    """A text stream that hands each piece of output on as it is written, so the caller reads it before the
    command ends."""

    def __init__(self, output_consumer: Callable[[bytes], None]) -> None:
        self.output_consumer = output_consumer

    def write(self, text: str) -> int:
        if text:
            self.output_consumer(text.encode())
        return len(text)


class CliEndpoint:
    """Answers POST /cli: runs the command line as the caller the request names, as a direct run would, waiting
    for another writer up to the /cli limit, and streams what it prints."""

    def __init__(self, home: JournalHome, listener_runner: CommitListenerRunner) -> None:
        self.line_run = LineRun(home, CLI_LIMIT_SECONDS, listener_runner)

    def answer(self, request: CliRequest, stream: TextIO) -> int:
        return self.line_run.run(request.argv, request.caller, stream, request.deadline, request.timing)
