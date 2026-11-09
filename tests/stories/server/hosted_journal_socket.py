import pytest

from server.journal_door import OWNER_ONLY_REASON
from tests.stories.server.support.hosted_viewer import agent_server, local_server, owner_server
from tests.stories.server.support.server_client import raw_answer, read_answer, request_answer
from tests.stories.support.story_checks import expect_value

OWNER_ONLY_ROUTES = {"viewer_key": "/viewer/key", "stop": "/stop", "handover": "/handover?tag=anything"}
UNREAD_BODY_HEAD = "POST {route} HTTP/1.1\r\nHost: journal\r\nContent-Length: 1000000\r\nConnection: close\r\n\r\n"


@pytest.mark.parametrize("route", OWNER_ONLY_ROUTES.values(), ids=OWNER_ONLY_ROUTES.keys())
def test_another_user_is_refused_an_owner_only_route_of_a_hosted_journal(agent_server, route):
    answer = request_answer(agent_server.socket_path, "POST", route, {})
    expect_value((answer.status, OWNER_ONLY_REASON in answer.text), (403, True))


@pytest.mark.parametrize("route", OWNER_ONLY_ROUTES.values(), ids=OWNER_ONLY_ROUTES.keys())
def test_the_refusal_is_sent_before_the_body_is_read(agent_server, route):
    answer = read_answer(raw_answer(agent_server.socket_path, UNREAD_BODY_HEAD.format(route=route).encode()))
    expect_value(answer.status, 403)


def test_another_user_still_reaches_the_command_line_route_of_a_hosted_journal(agent_server):
    answer = request_answer(agent_server.socket_path, "POST", "/cli", {"argv": []})
    expect_value(OWNER_ONLY_REASON in answer.text, False)


def test_the_journal_user_stops_a_hosted_journal(owner_server):
    answer = request_answer(owner_server.socket_path, "POST", "/stop", {})
    expect_value((answer.status, answer.json()), (200, {"status": "stopping"}))


@pytest.mark.parametrize("route", ["/viewer/key", "/stop"])
def test_a_local_journal_answers_the_same_routes_to_every_user(local_server, route):
    answer = request_answer(local_server.socket_path, "POST", route, {})
    expect_value(OWNER_ONLY_REASON in answer.text, False)
