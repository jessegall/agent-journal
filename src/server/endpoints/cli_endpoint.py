import io
from collections.abc import Callable
from dataclasses import dataclass
from typing import TextIO

from core.base.caller.caller_request import CallerRequest
from core.base.cli.line_run import LineRun
from core.base.journal_home import JournalHome
from core.base.type_guards import is_mapping, is_text_list


CLI_LIMIT_SECONDS = 600.0


class CliRequestError(Exception):
    """Raised when the body of a /cli request is not a command line and its caller."""


@dataclass(frozen=True)
class CliRequest:
    """One /cli request: the command line's words and what the server knows of its caller, the pid read from the
    socket rather than sent."""

    argv: list[str]
    caller: CallerRequest

    @classmethod
    def parsed(cls, data: object, pid: int) -> "CliRequest":
        if not is_mapping(data):
            raise CliRequestError("a /cli request is an object with argv, variables and folder")
        argv = data.get("argv")
        if not is_text_list(argv):
            raise CliRequestError("argv is the list of the command line's words")
        return cls(argv, CallerRequest.parsed({"variables": data.get("variables", {}), "folder": data.get("folder", ""), "pid": pid}))


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

    def __init__(self, home: JournalHome) -> None:
        self.line_run = LineRun(home, CLI_LIMIT_SECONDS)

    def answer(self, request: CliRequest, stream: TextIO) -> int:
        return self.line_run.run(request.argv, request.caller, stream)
