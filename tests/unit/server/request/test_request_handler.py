from unittest.mock import MagicMock, Mock

from engine.enums.log_level import LogLevel
from engine.performance.timing import Timing
from server.request import request_handler
from server.request.request_handler import RequestHandler


class BrokenPipeWriter:
    """The server's end of a socket whose caller disconnects once the answer's headers are sent."""

    def __init__(self) -> None:
        self.writes: list[bytes] = []
        self.caller_disconnected = False

    def write(self, data: bytes) -> int:
        if self.caller_disconnected:
            raise BrokenPipeError(32, "Broken pipe")
        self.writes.append(data)
        return len(data)

    def flush(self) -> None:
        pass


class RefusingCliEndpoint:
    """A command that refuses after its caller hung up: writing the refusal breaks the pipe."""

    def __init__(self, socket_file: BrokenPipeWriter) -> None:
        self.socket_file = socket_file

    def answer(self, request, stream) -> int:
        self.socket_file.caller_disconnected = True
        stream.write("refused: the task is not yours\n")
        return 1


def test_a_caller_hanging_up_during_a_refusal_is_no_server_error_and_gets_no_further_write(monkeypatch):
    socket_file = BrokenPipeWriter()
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


def plain_handler(server, path: str) -> tuple[RequestHandler, list[tuple[int, dict]]]:
    handler = object.__new__(RequestHandler)
    answers: list[tuple[int, dict]] = []
    handler.path, handler.journal_server = path, lambda: server
    handler.answer_json = lambda status, answer: answers.append((status, answer))
    return handler, answers


def test_an_unknown_route_is_answered_404_naming_it():
    handler, answers = plain_handler(MagicMock(), "/nowhere")
    handler.answer_get()
    assert answers == [(404, {"error": "no route /nowhere"})]


def test_an_error_outside_a_command_is_answered_500_in_one_line_and_logged_with_its_traceback():
    server = MagicMock()
    handler, answers = plain_handler(server, "/cli")

    def failing() -> None:
        raise ValueError("invalid literal for int() with base 10: 'many'")

    handler.answered_safely(failing)
    assert answers == [(500, {"error": "ValueError: invalid literal for int() with base 10: 'many'"})]
    logged = server.context.files.log_line.call_args.args
    assert "Traceback" in logged[0] and logged[1] is LogLevel.ERROR
