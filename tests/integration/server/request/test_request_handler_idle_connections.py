import http.client
import socket
import sqlite3
import threading

import pytest

from tests.integration.support.integration_server import integration_server

IDLE_LIMIT_SECONDS = 0.5
READ_LIMIT_SECONDS = 5.0
KEPT_OPEN_SECONDS = 1.5
SESSION = "s-1"
CONNECTION_COUNT = 40


@pytest.fixture
def idle_server(journal):
    with integration_server(journal, idle_connection_seconds=IDLE_LIMIT_SECONDS) as server:
        yield server


def opened_connection(server) -> socket.socket:
    connection = socket.socket(socket.AF_UNIX)
    connection.settimeout(READ_LIMIT_SECONDS)
    connection.connect(str(server.socket_path))
    return connection


def test_an_idle_keep_alive_connection_is_closed_by_the_server(idle_server):
    with opened_connection(idle_server) as connection:
        assert connection.recv(1) == b""


def test_forty_idle_connections_are_each_closed_and_hold_no_request_thread(idle_server):
    connections = [opened_connection(idle_server) for _ in range(CONNECTION_COUNT)]
    try:
        assert [connection.recv(1) for connection in connections] == [b""] * CONNECTION_COUNT
    finally:
        for connection in connections:
            connection.close()


def test_a_kept_connection_answers_each_request_and_closes_after_the_last(idle_server):
    with opened_connection(idle_server) as connection:
        client = http.client.HTTPConnection("journal")
        client.sock = connection
        for _ in range(2):
            client.request("GET", "/health")
            assert client.getresponse().read()
        assert connection.recv(1) == b""


def test_a_line_held_longer_than_the_idle_limit_is_answered_not_cut(idle_server):
    idle_server.start_agent(SESSION)
    made = idle_server.run_as('task make "Hold the line" --brief "A task to log on"', SESSION)
    assert made.exit_code == 0, made
    writer = sqlite3.connect(idle_server.journal.home.database, timeout=READ_LIMIT_SECONDS, autocommit=True, check_same_thread=False)
    writer.execute("BEGIN IMMEDIATE")
    release = threading.Timer(KEPT_OPEN_SECONDS, writer.execute, ["ROLLBACK"])
    release.start()
    try:
        answer = idle_server.run_as('task log 1 "held past the idle limit"', SESSION)
    finally:
        release.join(READ_LIMIT_SECONDS)
        writer.close()
    assert answer.exit_code == 0, answer
