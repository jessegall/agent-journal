import pytest

from server.hosted_journal_door import OWNER_REASON
from tests.stories.server.support.hosted_viewer import agent_server, local_server, owner_server
from tests.stories.server.support.server_client import raw_answer, read_answer, request_answer
from tests.stories.support.story_checks import expect_value

OWNER_ROUTES = {"viewer_key": "/viewer/key", "stop": "/stop", "handover": "/handover?tag=anything"}
HEAD_WITHOUT_BODY = "POST {route} HTTP/1.1\r\nHost: journal\r\nContent-Length: 1000000\r\nConnection: close\r\n\r\n"


@pytest.mark.parametrize("route", OWNER_ROUTES.values(), ids=OWNER_ROUTES.keys())
def test_an_agent_user_gets_403_on_the_owner_routes_of_a_hosted_journal(agent_server, route):
    answer = request_answer(agent_server.socket_path, "POST", route, {})
    expect_value((answer.status, OWNER_REASON in answer.text), (403, True))


@pytest.mark.parametrize("route", OWNER_ROUTES.values(), ids=OWNER_ROUTES.keys())
def test_the_403_comes_without_the_body_being_read(agent_server, route):
    answer = read_answer(raw_answer(agent_server.socket_path, HEAD_WITHOUT_BODY.format(route=route).encode()))
    expect_value(answer.status, 403)


def test_an_agent_user_reaches_the_command_line_route_of_a_hosted_journal(agent_server):
    answer = request_answer(agent_server.socket_path, "POST", "/cli", {"argv": []})
    expect_value(OWNER_REASON in answer.text, False)


def test_the_journal_user_stops_a_hosted_journal(owner_server):
    answer = request_answer(owner_server.socket_path, "POST", "/stop", {})
    expect_value((answer.status, answer.json()), (200, {"status": "stopping"}))


@pytest.mark.parametrize("route", ["/viewer/key", "/stop"])
def test_a_local_journal_answers_the_owner_routes_to_every_user(local_server, route):
    answer = request_answer(local_server.socket_path, "POST", route, {})
    expect_value(OWNER_REASON in answer.text, False)
