import os

import pytest

from core.modules.agents.bindings.agent_caller_resolver import CHAIN_ONLY_REFUSAL
from engine.caller.caller_request import SESSION_VARIABLE
from server.door.hosted_journal_door import HostedJournalDoor, OWNER_REASON
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.server.support.hosted_viewer import agent_server, local_server, owner_server
from tests.stories.server.support.server_client import raw_answer, read_answer, request_answer, server_story
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


def claimed_session_answer(new_story, owner_uid: int) -> str:
    story = new_story(fixture=BuilderStarted)
    with server_story(story, journal_door=HostedJournalDoor(owner_uid)) as server:
        line = {"argv": ["task", "list"], "variables": {SESSION_VARIABLE: "s-1"}, "folder": str(story.home.folder.parent)}
        return request_answer(server.socket_path, "POST", "/cli", line).text


@pytest.mark.parametrize("owner_uid, refused", [(os.getuid() + 1, True), (os.getuid(), False)], ids=["an agent of the socket group", "the journal's own user"])
def test_only_the_hosted_journals_own_user_is_named_by_the_session_it_sends(new_story, owner_uid, refused):
    expect_value(CHAIN_ONLY_REFUSAL in claimed_session_answer(new_story, owner_uid), refused)
