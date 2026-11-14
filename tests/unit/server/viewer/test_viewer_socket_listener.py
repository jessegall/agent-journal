import grp
import os
import socket
import stat
import tempfile
from pathlib import Path
from unittest.mock import MagicMock

import pytest

from server.viewer.viewer_socket_listener import ViewerSocketListener

PUBLIC_ORIGIN = "https://journal.example.com"
PUBLIC_HOST = "journal.example.com"


def group_name() -> str:
    return grp.getgrgid(os.getgid()).gr_name


@pytest.fixture
def socket_path():
    # a unix socket path must stay short, so it lives in a short temporary folder rather than pytest's tmp_path
    with tempfile.TemporaryDirectory(prefix="vs") as folder:
        yield Path(folder) / "viewer.sock"


def listener(socket_path: Path, inherited: socket.socket | None = None) -> ViewerSocketListener:
    return ViewerSocketListener(MagicMock(), MagicMock(), socket_path, group_name(), PUBLIC_ORIGIN, os.getuid(), inherited_socket=inherited)


def test_the_socket_file_has_mode_0660_and_the_proxy_group(socket_path):
    bound = listener(socket_path)
    file_status = socket_path.stat()
    assert stat.S_IMODE(file_status.st_mode) == 0o660 and file_status.st_gid == os.getgid()
    bound.server_close()


def test_a_stale_socket_file_is_removed_before_the_listener_binds(socket_path):
    socket_path.write_text("left by a server that died")
    bound = listener(socket_path)
    assert stat.S_ISSOCK(socket_path.stat().st_mode)
    bound.server_close()


def test_the_listener_names_the_public_host_and_has_no_port(socket_path):
    bound = listener(socket_path)
    assert bound.host == PUBLIC_HOST and bound.port == 0
    bound.server_close()


def test_a_socket_taken_over_keeps_its_file_and_its_waiting_request(socket_path):
    old = listener(socket_path)
    client = socket.socket(socket.AF_UNIX)
    client.settimeout(5)
    client.connect(str(socket_path))
    client.sendall(f"GET /nothing HTTP/1.1\r\nHost: {PUBLIC_HOST}\r\nConnection: close\r\n\r\n".encode())
    inherited = old.socket.dup()
    old.server_close()
    new = listener(socket_path, inherited)
    new.handle_request()
    assert client.recv(7) == b"HTTP/1."
    client.close()
    new.server_close()
