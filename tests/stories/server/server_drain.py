import threading
import time

from server.request_handler import RequestHandler
from tests.stories.core.support.fixtures import ThreeTasks
from install.unix_connection import UnixConnection
from tests.stories.server.support.server_client import request_answer, running_server

RUNNING_SECONDS = 1.5
IDLE_LIMIT_SECONDS = 1.0
DRAIN_SECONDS = 10


def test_a_stop_during_a_running_request_lets_it_finish_while_an_idle_connection_closes_at_once(new_story, monkeypatch):
    answers: list[int] = []
    arrived = threading.Event()
    answer_get = RequestHandler.answer_get

    def slow_get(self: RequestHandler) -> None:
        if self.path == "/slow":
            arrived.set()
            time.sleep(RUNNING_SECONDS)
            self.answer_json(200, {"slow": "done"})
            return
        answer_get(self)

    monkeypatch.setattr(RequestHandler, "answer_get", slow_get)
    with running_server(new_story(fixture=ThreeTasks).home) as (server, socket_path, _):
        idle = UnixConnection(str(socket_path))
        idle.request("GET", "/health")
        idle.getresponse().read()
        runner = threading.Thread(target=lambda: answers.append(request_answer(socket_path, "GET", "/slow").status))
        runner.start()
        assert arrived.wait(5)
        server.request_stop()
        started = time.monotonic()
        server.drain(DRAIN_SECONDS)
        elapsed = time.monotonic() - started
        runner.join(5)
        idle.close()
    assert answers == [200], "the running request was cut off by the stop"
    assert RUNNING_SECONDS - 0.5 < elapsed < RUNNING_SECONDS + IDLE_LIMIT_SECONDS, elapsed
