import os
import socket
import stat
from unittest.mock import MagicMock

from server.viewer.viewer_listener import ViewerListener
from server.viewer.viewer_socket_listener import ViewerSocketListener
from tests.stories.server.support.hosted_viewer import PUBLIC_HOST, PUBLIC_ORIGIN, group_name, hosted_server, hosted_viewer_factory, socket_answer, socket_path
from tests.stories.server.support.server_client import server_story
from tests.stories.support.story_checks import expect_value

SERVER_STATE = "/api/server-state"


def test_a_hosted_viewer_answers_on_its_socket_file_to_the_public_host(hosted_server):
    _, socket_path = hosted_server
    answer = socket_answer(socket_path, "GET", SERVER_STATE)
    expect_value(answer.status, 200)
    expect_value(answer.json()["restarting"], False)


def test_a_hosted_viewer_refuses_a_request_naming_another_host(hosted_server):
    _, socket_path = hosted_server
    expect_value(socket_answer(socket_path, "GET", SERVER_STATE, host="127.0.0.1:80").status, 403)


def test_the_socket_file_of_a_hosted_viewer_has_mode_0660_and_the_proxy_group(hosted_server):
    _, socket_path = hosted_server
    file_status = socket_path.stat()
    expect_value(stat.S_IMODE(file_status.st_mode), 0o660)
    expect_value(file_status.st_gid, os.getgid())


def test_a_stale_socket_file_is_removed_before_the_viewer_binds(new_story, socket_path):
    socket_path.write_text("left by a server that died")
    with server_story(new_story(), viewer_factory=hosted_viewer_factory(socket_path, os.getuid())):
        expect_value(socket_answer(socket_path, "GET", SERVER_STATE).status, 200)


def test_a_local_viewer_still_binds_127_0_0_1(new_story):
    with server_story(new_story()) as server:
        expect_value(isinstance(server.context.viewer, ViewerListener), True)
        expect_value(server.context.viewer.host, f"127.0.0.1:{server.viewer_port()}")


def test_a_viewer_socket_taken_over_keeps_its_file_and_its_waiting_request(socket_path):
    old = ViewerSocketListener(MagicMock(), MagicMock(), socket_path, group_name(), PUBLIC_ORIGIN, os.getuid())
    client = socket.socket(socket.AF_UNIX)
    client.settimeout(5)
    client.connect(str(socket_path))
    client.sendall(f"GET /nothing HTTP/1.1\r\nHost: {PUBLIC_HOST}\r\nConnection: close\r\n\r\n".encode())
    inherited = old.socket.dup()
    old.server_close()
    new = ViewerSocketListener(MagicMock(), MagicMock(), socket_path, group_name(), PUBLIC_ORIGIN, os.getuid(), inherited_socket=inherited)
    new.handle_request()
    expect_value(client.recv(7), b"HTTP/1.")
    client.close()
    new.server_close()
