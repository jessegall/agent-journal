import http.client
import socket

import pytest

from tests.stories.core.support.fixtures import StartedPlanTask
from tests.stories.server.support.server_client import server_story

IDLE_LIMIT_SECONDS = 0.5
READ_LIMIT_SECONDS = 5.0


def test_an_idle_keep_alive_connection_is_closed_by_the_server(idle_server):
    with socket.socket(socket.AF_UNIX) as connection:
        connection.settimeout(READ_LIMIT_SECONDS)
        connection.connect(str(idle_server.socket_path))
        assert connection.recv(1) == b""


def test_a_kept_connection_answers_each_request_and_closes_after_the_last(idle_server):
    with socket.socket(socket.AF_UNIX) as connection:
        connection.settimeout(READ_LIMIT_SECONDS)
        connection.connect(str(idle_server.socket_path))
        client = http.client.HTTPConnection("journal")
        client.sock = connection
        for _ in range(2):
            client.request("GET", "/health")
            assert client.getresponse().read()
        assert connection.recv(1) == b""


@pytest.fixture
def idle_server(new_story):
    with server_story(new_story(fixture=StartedPlanTask), idle_connection_seconds=IDLE_LIMIT_SECONDS) as story:
        yield story
