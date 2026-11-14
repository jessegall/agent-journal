from server.viewer.viewer_listener import ViewerListener
from tests.integration.support.hosted_viewer import session_cookie, socket_answer

SERVER_STATE = "/api/server-state"


def test_a_hosted_viewer_answers_on_its_socket_file_to_the_public_host(hosted_server):
    server, socket_path = hosted_server
    answer = socket_answer(socket_path, "GET", SERVER_STATE, headers=session_cookie(server))
    assert answer.status == 200
    assert not answer.json()['restarting']


def test_a_local_viewer_still_binds_127_0_0_1(local_server):
    assert isinstance(local_server.context.viewer, ViewerListener)
    assert local_server.context.viewer.host == f'127.0.0.1:{local_server.viewer_port()}'
