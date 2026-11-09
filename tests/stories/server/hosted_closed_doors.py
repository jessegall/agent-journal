import pytest

from server.viewer.closed_service import ClosedService
from tests.stories.server.support.hosted_viewer import PUBLIC_ORIGIN, hosted_server, local_server, socket_answer, socket_path
from tests.stories.server.support.server_client import viewer_answer
from tests.stories.support.story_checks import expect_value

ORIGIN_HEADERS = {"Origin": PUBLIC_ORIGIN, "Sec-Fetch-Site": "same-origin"}
CLOSED_REASON = "not available on a hosted journal yet"
CLOSED_GETS = {
    "login_by_link": "/?key=anything",
    "phone_pairing_page": "/pair",
    "phone_file": "/viewer/phone-sw.js",
    "share_link": "/viewer/share/token",
}
CLOSED_POSTS = {
    "login_link": "/api/login-link",
    "phone_pairing": "/viewer/pair",
    "phone_notices": "/api/push",
    "share_comments": "/api/share/comments",
}


@pytest.mark.parametrize("route", CLOSED_GETS.values(), ids=CLOSED_GETS.keys())
def test_a_closed_door_answers_404_on_a_hosted_journal_for_a_get(hosted_server, route):
    _, socket_path = hosted_server
    answer = socket_answer(socket_path, "GET", route)
    expect_value((answer.status, CLOSED_REASON in answer.text), (404, True))


@pytest.mark.parametrize("route", CLOSED_POSTS.values(), ids=CLOSED_POSTS.keys())
def test_a_closed_door_answers_404_on_a_hosted_journal_for_a_post(hosted_server, route):
    _, socket_path = hosted_server
    answer = socket_answer(socket_path, "POST", route, headers=ORIGIN_HEADERS, body="{}")
    expect_value((answer.status, CLOSED_REASON in answer.text), (404, True))


@pytest.mark.parametrize("route", CLOSED_GETS.values(), ids=CLOSED_GETS.keys())
def test_the_same_get_is_not_closed_on_a_local_journal(local_server, route):
    _, _, text = viewer_answer(local_server.viewer_port(), route, "", "")
    expect_value(CLOSED_REASON in text, False)


@pytest.mark.parametrize("route", CLOSED_POSTS.values(), ids=CLOSED_POSTS.keys())
def test_the_same_post_is_not_closed_on_a_local_journal(local_server, route):
    _, _, text = viewer_answer(local_server.viewer_port(), route, "", "", {})
    expect_value(CLOSED_REASON in text, False)


def test_a_hosted_journal_starts_no_tunnel_and_no_plugin_part(hosted_server):
    server, _ = hosted_server
    expect_value([service for service in ClosedService if not server.context.viewer.closed_doors.closes_service(service)], [])


def test_a_local_journal_starts_every_part(local_server):
    expect_value([service for service in ClosedService if local_server.context.viewer.closed_doors.closes_service(service)], [])
