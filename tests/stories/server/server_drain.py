import threading

from engine.connection.unix_connection import UnixConnection
from server.request.request_handler import RequestHandler
from tests.stories.core.support.fixtures import ThreeTasks
from tests.stories.server.support.server_client import request_answer, running_server
from tests.stories.support.story_checks import expect_value, expect_wait_arrived

WAIT_SECONDS = 10
DRAIN_SECONDS = 10


def test_a_stop_during_a_running_request_lets_it_finish_while_an_idle_connection_closes_at_once(new_story, monkeypatch):
    statuses: list[int] = []
    arrived, released = threading.Event(), threading.Event()
    answer_get = RequestHandler.answer_get

    def slow_get(self: RequestHandler) -> None:
        if self.path != "/held":
            answer_get(self)
            return
        arrived.set()
        released.wait(WAIT_SECONDS)
        self.answer_json(200, {"held": "done"})

    monkeypatch.setattr(RequestHandler, "answer_get", slow_get)
    with running_server(new_story(fixture=ThreeTasks).home) as (server, socket_path, _):
        idle = UnixConnection(str(socket_path), WAIT_SECONDS, "journal")
        idle.request("GET", "/health")
        idle.getresponse().read()
        runner = threading.Thread(target=lambda: statuses.append(request_answer(socket_path, "GET", "/held").status))
        runner.start()
        expect_wait_arrived(arrived, WAIT_SECONDS)
        server.request_stop()
        draining = threading.Thread(target=lambda: server.drain(DRAIN_SECONDS))
        draining.start()
        expect_changed_sock_idle(idle, None)
        idle.sock.settimeout(WAIT_SECONDS)
        expect_recv_sock_idle(idle, 1, b"")
        released.set()
        draining.join(WAIT_SECONDS)
        runner.join(WAIT_SECONDS)
        idle.close()
    expect_value(statuses, [200])
    expect_absent_draining(draining)


def expect_absent_draining(draining) -> None:
    actual = draining.is_alive()
    assert not actual, actual


def expect_recv_sock_idle(idle, number, expected) -> None:
    actual = idle.sock.recv(number)
    assert actual == expected, actual


def expect_changed_sock_idle(idle, expected) -> None:
    actual = idle.sock
    assert actual is not expected, actual
