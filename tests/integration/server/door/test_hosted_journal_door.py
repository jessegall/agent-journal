import os

import pytest

from core.modules.agents.bindings.agent_caller_resolver import CHAIN_REQUIRED_REFUSAL
from engine.caller.caller_request import SESSION_VARIABLE
from server.door.hosted_journal_door import HostedJournalDoor, OWNER_REASON
from tests.integration.support.integration_server import integration_server
from tests.integration.support.server_harness import raw_answer, read_answer

OWNER_ROUTES = {"viewer_key": "/viewer/key", "stop": "/stop", "handover": "/handover?tag=anything"}
HEAD_WITHOUT_BODY = "POST {route} HTTP/1.1\r\nHost: journal\r\nContent-Length: 1000000\r\nConnection: close\r\n\r\n"
SESSION = "s-1"


@pytest.fixture
def owner_server(journal):
    with integration_server(journal, journal_door=HostedJournalDoor(os.getuid())) as server:
        yield server


@pytest.mark.parametrize("route", OWNER_ROUTES.values(), ids=OWNER_ROUTES.keys())
def test_an_agent_user_gets_403_on_the_owner_routes_of_a_hosted_journal(agent_server, route):
    answer = agent_server.request("POST", route, {})
    assert (answer.status, OWNER_REASON in answer.text) == (403, True), answer


@pytest.mark.parametrize("route", OWNER_ROUTES.values(), ids=OWNER_ROUTES.keys())
def test_the_403_comes_without_the_body_being_read(agent_server, route):
    answer = read_answer(raw_answer(agent_server.socket_path, HEAD_WITHOUT_BODY.format(route=route).encode()))
    assert answer.status == 403, answer


def test_an_agent_user_reaches_the_command_line_route_of_a_hosted_journal(agent_server):
    answer = agent_server.request("POST", "/cli", {"argv": []})
    assert OWNER_REASON not in answer.text, answer


def test_the_journal_user_stops_a_hosted_journal(owner_server):
    answer = owner_server.request("POST", "/stop", {})
    assert (answer.status, answer.json()) == (200, {"status": "stopping"}), answer


@pytest.mark.parametrize("route", ["/viewer/key", "/stop"])
def test_a_local_journal_answers_the_owner_routes_to_every_user(local_server, route):
    answer = local_server.request("POST", route, {})
    assert OWNER_REASON not in answer.text, answer


@pytest.mark.parametrize("owner_uid, refused", [(os.getuid() + 1, True), (os.getuid(), False)], ids=["an agent of the socket group", "the journal's own user"])
def test_only_the_hosted_journals_own_user_is_named_by_the_session_it_sends(journal, owner_uid, refused):
    with integration_server(journal, journal_door=HostedJournalDoor(owner_uid)) as server:
        server.start_agent(SESSION)
        line = {"argv": ["task", "list"], "variables": {SESSION_VARIABLE: SESSION}, "folder": str(journal.home.folder.parent)}
        answer = server.request("POST", "/cli", line)
    assert (CHAIN_REQUIRED_REFUSAL in answer.text) == refused, answer
