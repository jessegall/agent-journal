import threading

from engine.connection.unix_connection import UnixConnection
from engine.testing.stories.counted_connections import CountedConnections
from server.request.request_handler import RequestHandler
from tests.integration.support.integration_server import integration_server
from tests.integration.support.server_harness import request_answer, running_server

WAIT_SECONDS = 10
DRAIN_SECONDS = 10
ANSWER_SIZE = 200000
SESSION = "s-1"


def held_get(monkeypatch, arrived: threading.Event, released: threading.Event, answer: dict[str, str], answered: threading.Event | None = None) -> None:
    answer_get = RequestHandler.answer_get

    def slow_get(self: RequestHandler) -> None:
        if self.path != "/held":
            answer_get(self)
            return
        arrived.set()
        released.wait(WAIT_SECONDS)
        try:
            self.answer_json(200, answer)
        finally:
            if answered is not None:
                answered.set()

    monkeypatch.setattr(RequestHandler, "answer_get", slow_get)


def test_a_stop_during_a_running_request_lets_it_finish_while_an_idle_connection_closes_at_once(synced_home, monkeypatch):
    statuses: list[int] = []
    arrived, released = threading.Event(), threading.Event()
    held_get(monkeypatch, arrived, released, {"held": "done"})
    with running_server(synced_home) as (server, socket_path, _):
        idle = UnixConnection(str(socket_path), WAIT_SECONDS, "journal")
        idle.request("GET", "/health")
        idle.getresponse().read()
        runner = threading.Thread(target=lambda: statuses.append(request_answer(socket_path, "GET", "/held").status))
        runner.start()
        assert arrived.wait(WAIT_SECONDS)
        server.request_stop()
        draining = threading.Thread(target=lambda: server.drain(DRAIN_SECONDS))
        draining.start()
        assert idle.sock is not None
        idle.sock.settimeout(WAIT_SECONDS)
        assert idle.sock.recv(1) == b""
        released.set()
        draining.join(WAIT_SECONDS)
        runner.join(WAIT_SECONDS)
        idle.close()
    assert statuses == [200]
    assert not draining.is_alive()


def test_a_client_that_leaves_before_its_answer_writes_no_traceback(synced_home, monkeypatch, capsys):
    arrived, released, answered = threading.Event(), threading.Event(), threading.Event()
    held_get(monkeypatch, arrived, released, {"held": "x" * ANSWER_SIZE}, answered)
    with running_server(synced_home) as (_, socket_path, _):
        leaving = UnixConnection(str(socket_path), WAIT_SECONDS, "journal")
        leaving.request("GET", "/held")
        assert arrived.wait(WAIT_SECONDS)
        leaving.close()
        released.set()
        assert answered.wait(WAIT_SECONDS)
        assert request_answer(socket_path, "GET", "/health").status == 200
    log = synced_home.folder / "runtime" / "server.log"
    assert "Traceback" not in (log.read_text() if log.is_file() else "")
    assert "BrokenPipeError" not in capsys.readouterr().err


def test_a_server_stop_closes_every_kept_connection(journal):
    with CountedConnections(journal.home) as connections:
        with integration_server(journal) as server:
            server.start_agent(SESSION)
            made = server.run_as('task make "Count the connections" --brief "A write the server makes"', SESSION)
            assert made.exit_code == 0, made
    assert connections.count > 0 and connections.open_count() == 0, f"{connections.open_count()} of {connections.count} connections stayed open"
