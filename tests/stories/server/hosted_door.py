import os

from server.viewer.hosted_door import ANONYMOUS_BODY_BYTES
from tests.stories.server.support.hosted_viewer import PUBLIC_ORIGIN, hosted_server, hosted_viewer_factory, session_cookie, socket_answer, socket_path
from tests.stories.server.support.server_client import server_story
from tests.stories.support.story_checks import expect_value

ORIGIN_HEADERS = {"Origin": PUBLIC_ORIGIN, "Sec-Fetch-Site": "same-origin"}
LINE_BODY = '{"line": "task make Intruder"}'


def test_a_caller_that_is_not_the_proxy_gets_403(new_story, socket_path):
    with server_story(new_story(), viewer_factory=hosted_viewer_factory(socket_path, os.getuid() + 1)):
        answer = socket_answer(socket_path, "GET", "/api/server-state")
        expect_value(answer.status, 403)
        expect_value("answers only its proxy" in answer.text, True)


def test_a_request_naming_another_host_gets_403(hosted_server):
    _, socket_path = hosted_server
    expect_value(socket_answer(socket_path, "GET", "/api/server-state", host="evil.example.com").status, 403)


def test_a_post_from_another_origin_gets_403(hosted_server):
    _, socket_path = hosted_server
    answer = socket_answer(socket_path, "POST", "/api/line", headers={"Origin": "https://evil.example.com", "Sec-Fetch-Site": "cross-site"}, body=LINE_BODY)
    expect_value(answer.status, 403)


def test_a_post_with_neither_header_gets_403_and_runs_nothing(hosted_server):
    server, socket_path = hosted_server
    expect_value(socket_answer(socket_path, "POST", "/api/line", body=LINE_BODY).status, 403)
    server.story.expect_success("task list", "nothing found")


def test_a_same_origin_post_passes_the_door_and_meets_the_login_check(hosted_server):
    _, socket_path = hosted_server
    expect_value(socket_answer(socket_path, "POST", "/api/line", headers=ORIGIN_HEADERS, body=LINE_BODY).status, 401)


def test_a_large_post_from_someone_not_logged_in_gets_413_and_its_body_is_never_read(hosted_server):
    _, socket_path = hosted_server
    answer = socket_answer(socket_path, "POST", "/api/line", headers=ORIGIN_HEADERS, declared_bytes=ANONYMOUS_BODY_BYTES + 6000)
    expect_value(answer.status, 413)


def test_a_get_without_origin_headers_is_answered(hosted_server):
    server, socket_path = hosted_server
    expect_value(socket_answer(socket_path, "GET", "/api/server-state", headers=session_cookie(server)).status, 200)
