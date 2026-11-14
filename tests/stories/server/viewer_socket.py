from tests.stories.server.support.hosted_viewer import hosted_server, local_server, socket_path  # noqa: F401

from server.viewer.viewer_listener import ViewerListener
from tests.stories.server.support.hosted_viewer import session_cookie, socket_answer
from tests.stories.support.story_checks import expect_value

SERVER_STATE = "/api/server-state"


def test_a_hosted_viewer_answers_on_its_socket_file_to_the_public_host(hosted_server):
    server, socket_path = hosted_server
    answer = socket_answer(socket_path, "GET", SERVER_STATE, headers=session_cookie(server))
    expect_value(answer.status, 200)
    expect_value(answer.json()["restarting"], False)


def test_a_local_viewer_still_binds_127_0_0_1(local_server):
    expect_value(isinstance(local_server.context.viewer, ViewerListener), True)
    expect_value(local_server.context.viewer.host, f"127.0.0.1:{local_server.viewer_port()}")
