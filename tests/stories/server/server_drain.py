import threading

from install.unix_connection import UnixConnection
from server.request_handler import RequestHandler
from tests.stories.core.support.fixtures import ThreeTasks
from tests.stories.server.support.server_client import request_answer, running_server

WAIT_SECONDS = 10
DRAIN_SECONDS = 10


def test_a_stop_during_a_running_request_lets_it_finish_while_an_idle_connection_closes_at_once(new_story, monkeypatch):
    statuses: list[int] = []
    arrived, released = threading.Event(), threading.Event()
    answer_get = RequestHandler.answer_get

    def held_get(self: RequestHandler) -> None:
        if self.path != "/held":
            answer_get(self)
            return
        arrived.set()
        released.wait(WAIT_SECONDS)
        self.answer_json(200, {"held": "done"})

    monkeypatch.setattr(RequestHandler, "answer_get", held_get)
    with running_server(new_story(fixture=ThreeTasks).home) as (server, socket_path, _):
        idle = UnixConnection(str(socket_path))
        idle.request("GET", "/health")
        idle.getresponse().read()
        runner = threading.Thread(target=lambda: statuses.append(request_answer(socket_path, "GET", "/held").status))
        runner.start()
        assert arrived.wait(WAIT_SECONDS)
        server.request_stop()
        draining = threading.Thread(target=lambda: server.drain(DRAIN_SECONDS))
        draining.start()
        assert idle.sock is not None and idle.sock.recv(1) == b"", "the idle connection was not closed"
        released.set()
        draining.join(WAIT_SECONDS)
        runner.join(WAIT_SECONDS)
        idle.close()
    assert statuses == [200] and not draining.is_alive(), "the running request was cut off by the stop"
