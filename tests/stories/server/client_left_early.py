import threading

from engine.connection.unix_connection import UnixConnection
from server.request_handler import RequestHandler
from tests.stories.core.support.fixtures import ThreeTasks
from tests.stories.server.support.server_client import request_answer, running_server
from tests.stories.support.story_checks import expect_wait_arrived

WAIT_SECONDS = 10
ANSWER_SIZE = 200000


def test_a_client_that_leaves_before_its_answer_writes_no_traceback(new_story, monkeypatch, capsys):
    arrived, released, answered = threading.Event(), threading.Event(), threading.Event()
    answer_get = RequestHandler.answer_get

    def stalled_get(self: RequestHandler) -> None:
        if self.path != "/held":
            answer_get(self)
            return
        arrived.set()
        released.wait(WAIT_SECONDS)
        try:
            self.answer_json(200, {"held": "x" * ANSWER_SIZE})
        finally:
            answered.set()

    monkeypatch.setattr(RequestHandler, "answer_get", stalled_get)
    story = new_story(fixture=ThreeTasks)
    with running_server(story.home) as (_, socket_path, _):
        leaving = UnixConnection(str(socket_path), WAIT_SECONDS, "journal")
        leaving.request("GET", "/held")
        expect_wait_arrived(arrived, WAIT_SECONDS)
        leaving.close()
        released.set()
        expect_wait_arrived(answered, WAIT_SECONDS)
        expect_status_request_answer(socket_path, "GET", "/health", 200)
    log = story.home.folder / "runtime" / "server.log"
    expect_value_without_2(log, "", "Traceback")
    expect_err_readouterr_capsys_without(capsys, "BrokenPipeError")


def expect_err_readouterr_capsys_without(capsys, expected) -> None:
    actual = capsys.readouterr().err
    assert expected not in actual, actual


def expect_value_without_2(log, text, expected) -> None:
    actual = log.read_text() if log.is_file() else text
    assert expected not in actual, actual


def expect_status_request_answer(socket_path, text, text_2, expected) -> None:
    actual = request_answer(socket_path, text, text_2).status
    assert actual == expected, actual
