import http.client
import os
import socket
from socketserver import StreamRequestHandler
from unittest.mock import MagicMock, Mock

import pytest

from engine.journal.journal_home import JournalHome
from server.handover.handover_descriptors import QUEUED_CONNECTIONS, HandoverDescriptors
from server.request.journal_server import JournalServer
from engine.serving.server_files import ServerFiles
from server.viewer.viewer_listener import ViewerListener


class ShoutingHandler(StreamRequestHandler):
    def handle(self) -> None:
        self.wfile.write(self.rfile.readline().upper())


@pytest.fixture
def path(tmp_path) -> str:
    return str(JournalHome(tmp_path).socket("server"))


def connected(path: str) -> socket.socket:
    client = socket.socket(socket.AF_UNIX)
    client.connect(path)
    return client


def test_a_connection_waiting_on_the_old_server_is_answered_by_the_server_that_took_its_socket(path):
    old = JournalServer(path, ShoutingHandler, Mock())
    client = connected(path)
    client.sendall(b"hello\n")
    inherited = old.socket.dup()
    old.server_close()
    new = JournalServer(path, ShoutingHandler, Mock(), inherited)
    new.handle_request()
    new.drain(5)
    new.server_close()
    assert client.recv(16) == b"HELLO\n"
    client.close()


def test_the_queue_holds_as_many_clients_as_a_hand_over_needs(path):
    server = JournalServer(path, ShoutingHandler, Mock())
    clients = [connected(path) for _ in range(QUEUED_CONNECTIONS)]
    for client in clients:
        client.close()
    server.server_close()


def test_a_viewer_that_took_the_socket_keeps_the_port_and_its_waiting_request():
    old = ViewerListener(MagicMock(), MagicMock(), lambda: None)
    port = old.port
    connection = http.client.HTTPConnection("127.0.0.1", port, timeout=5)
    connection.request("GET", "/nothing")
    inherited = old.socket.dup()
    old.server_close()
    new = ViewerListener(MagicMock(), MagicMock(), lambda: None, inherited_socket=inherited)
    assert new.port == port
    new.handle_request()
    assert connection.getresponse().status > 0
    connection.close()
    new.server_close()


def test_the_lock_stays_held_while_its_descriptor_moves_to_the_next_server(tmp_path):
    first, second = ServerFiles(JournalHome(tmp_path)), ServerFiles(JournalHome(tmp_path))
    assert first.acquire_lock()
    second.keep_lock_descriptor(os.dup(first.lock_file.fileno()))
    first.release_lock()
    assert not ServerFiles(JournalHome(tmp_path)).acquire_lock()
    second.release_lock()
    assert ServerFiles(JournalHome(tmp_path)).acquire_lock()


def test_descriptors_travel_as_text():
    descriptors = HandoverDescriptors(3, 4, 5, 6, 7)
    assert HandoverDescriptors.parsed(descriptors.text) == descriptors
