from unittest.mock import MagicMock, Mock

from engine.enums.log_level import LogLevel
from engine.performance.timing import Timing
from server.request import request_handler
from server.request.request_handler import RequestHandler


class HungUpSocketFile:
    """The server's end of a socket whose caller hangs up once the answer's headers are sent."""

    def __init__(self) -> None:
        self.writes: list[bytes] = []
        self.caller_hung_up = False

    def write(self, data: bytes) -> int:
        if self.caller_hung_up:
            raise BrokenPipeError(32, "Broken pipe")
        self.writes.append(data)
        return len(data)

    def flush(self) -> None:
        pass


class RefusingCliEndpoint:
    """A command that refuses after its caller hung up: writing the refusal breaks the pipe."""

    def __init__(self, socket_file: HungUpSocketFile) -> None:
        self.socket_file = socket_file

    def answer(self, request, stream) -> int:
        self.socket_file.caller_hung_up = True
        stream.write("refused: the task is not yours\n")
        return 1


def test_a_caller_hanging_up_during_a_refusal_is_no_server_error_and_gets_no_further_write(monkeypatch):
    socket_file = HungUpSocketFile()
    server = MagicMock()
    handler = object.__new__(RequestHandler)
    handler.wfile, handler.request_version, handler.requestline, handler.client_address = socket_file, "HTTP/1.1", "POST /cli HTTP/1.1", ("", 0)
    handler.timing = Timing()
    handler.journal_server = lambda: server
    handler.log_request = lambda *arguments: None
    monkeypatch.setattr(request_handler, "CliEndpoint", lambda *arguments: RefusingCliEndpoint(socket_file))
    request = Mock(argv=["task", "close"])
    request.caller.variables = {}

    handler.answer_cli(request)

    error_lines = [call for call in server.context.files.log_line.call_args_list if LogLevel.ERROR in call.args]
    assert error_lines == []
    assert len(socket_file.writes) == 1
    assert handler.close_connection
