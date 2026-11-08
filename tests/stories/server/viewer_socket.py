import grp
import os
import shutil
import socket
import stat
import tempfile
from pathlib import Path
from unittest.mock import MagicMock

import pytest

from server.viewer.viewer_listener import ViewerListener
from server.viewer.viewer_socket_listener import ViewerSocketListener
from tests.stories.server.support.server_client import answer_from as parsed_answer, raw_answer, server_story
from tests.stories.support.story_checks import expect_value

PUBLIC_ORIGIN = "https://journal.example.com"
PUBLIC_HOST = "journal.example.com"
SERVER_STATE = "/api/server-state"


def socket_answer(socket_path: Path, route: str, host: str):
    head = f"GET {route} HTTP/1.1\r\nHost: {host}\r\nConnection: close\r\n\r\n".encode()
    return parsed_answer(raw_answer(socket_path, head))


def group_name() -> str:
    return grp.getgrgid(os.getgid()).gr_name


@pytest.fixture
def socket_path():
    folder = Path(tempfile.mkdtemp(dir="/tmp"))
    yield folder / "viewer.sock"
    shutil.rmtree(folder)


def hosted_viewer_factory(socket_path: Path):
    return lambda login, routes: ViewerSocketListener(login, routes, socket_path, group_name(), PUBLIC_ORIGIN)


def test_a_hosted_viewer_answers_on_its_socket_file_to_the_public_host(new_story, socket_path):
    with server_story(new_story(), viewer_factory=hosted_viewer_factory(socket_path)):
        answer = socket_answer(socket_path, SERVER_STATE, PUBLIC_HOST)
        expect_value(answer.status, 200)
        expect_value(answer.json()["restarting"], False)


def test_a_hosted_viewer_refuses_a_request_naming_another_host(new_story, socket_path):
    with server_story(new_story(), viewer_factory=hosted_viewer_factory(socket_path)):
        expect_value(socket_answer(socket_path, SERVER_STATE, "127.0.0.1:80").status, 403)


def test_the_socket_file_of_a_hosted_viewer_has_mode_0660_and_the_proxy_group(new_story, socket_path):
    with server_story(new_story(), viewer_factory=hosted_viewer_factory(socket_path)):
        file_status = socket_path.stat()
        expect_value(stat.S_IMODE(file_status.st_mode), 0o660)
        expect_value(file_status.st_gid, os.getgid())


def test_a_stale_socket_file_is_removed_before_the_viewer_binds(new_story, socket_path):
    socket_path.write_text("left by a server that died")
    with server_story(new_story(), viewer_factory=hosted_viewer_factory(socket_path)):
        expect_value(socket_answer(socket_path, SERVER_STATE, PUBLIC_HOST).status, 200)


def test_a_local_viewer_still_binds_127_0_0_1(new_story):
    with server_story(new_story()) as server:
        expect_value(isinstance(server.context.viewer, ViewerListener), True)
        expect_value(server.context.viewer.host, f"127.0.0.1:{server.viewer_port()}")


def test_a_viewer_socket_taken_over_keeps_its_file_and_its_waiting_request(socket_path):
    old = ViewerSocketListener(MagicMock(), MagicMock(), socket_path, group_name(), PUBLIC_ORIGIN)
    client = socket.socket(socket.AF_UNIX)
    client.settimeout(5)
    client.connect(str(socket_path))
    client.sendall(f"GET /nothing HTTP/1.1\r\nHost: {PUBLIC_HOST}\r\nConnection: close\r\n\r\n".encode())
    inherited = old.socket.dup()
    old.server_close()
    new = ViewerSocketListener(MagicMock(), MagicMock(), socket_path, group_name(), PUBLIC_ORIGIN, inherited_socket=inherited)
    new.handle_request()
    expect_value(client.recv(7), b"HTTP/1.")
    client.close()
    new.server_close()
