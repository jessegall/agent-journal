import base64
import http.client
import json

import pytest

from tests.integration.support.integration_server import integration_server
from tests.integration.support.server_harness import TIMEOUT_SECONDS, viewer_answer
from tests.integration.support.share_links import plan_and_person

SESSION = "s-1"


@pytest.fixture
def plan_server(journal):
    user = plan_and_person(journal)
    with integration_server(journal) as server:
        server.expect_viewer_login(server.viewer_key("Ada"))
        yield server, user


def made_link(server, user, options: str = "") -> dict:
    return json.loads(server.journal.run(f"share make plans:1 {options} --json", user).text)


def share_cookie(server, made: dict) -> str:
    return f"{server.cookie_name('journal_share')}={made['token']}"


def status_of(server, path: str, cookie: str = "") -> int:
    return viewer_answer(server.viewer_port(), path, cookie, "")[0]


def with_password(server, path: str, password: str) -> tuple[int, dict[str, str]]:
    connection = http.client.HTTPConnection("127.0.0.1", server.viewer_port(), timeout=TIMEOUT_SECONDS)
    encoded = base64.b64encode(f"any:{password}".encode()).decode()
    try:
        connection.request("GET", path, headers={"Host": f"127.0.0.1:{server.viewer_port()}", "Authorization": f"Basic {encoded}"})
        response = connection.getresponse()
        response.read()
        return response.status, dict(response.getheaders())
    finally:
        connection.close()


def test_a_waiting_link_opens_nothing_until_it_is_accepted(plan_server):
    server, user = plan_server
    server.start_agent(SESSION)
    assert server.run_as("overview", SESSION).exit_code == 0
    request = json.loads(server.run_as("share make plans:1 --environment main --json", SESSION).text)
    assert request["token"] is None and request["link"] is None, request
    accepted = json.loads(server.journal.run("share accept 1 --json", user).text)
    assert status_of(server, accepted["link"]) == 200


def test_a_locked_link_asks_for_its_password_and_a_guessed_cookie_opens_nothing(plan_server):
    server, user = plan_server
    made = made_link(server, user, "--password open-sesame")
    status, headers, _ = viewer_answer(server.viewer_port(), made["link"], "", "")
    assert status == 401 and "Basic" in headers["WWW-Authenticate"], headers
    assert status_of(server, "/api/session", share_cookie(server, made)) == 401
    assert with_password(server, made["link"], "wrong")[0] == 401
    status, headers = with_password(server, made["link"], "open-sesame")
    assert status == 200 and headers["Set-Cookie"].startswith(server.cookie_name("journal_share") + "="), headers
    assert status_of(server, "/api/session", headers["Set-Cookie"].split(";")[0]) == 200
    assert status_of(server, "/api/session", share_cookie(server, made)) == 401
    assert status_of(server, made["link"]) == 401


def test_each_opening_counts_as_a_view(plan_server):
    server, user = plan_server
    made = made_link(server, user)
    status_of(server, made["link"])
    status_of(server, made["link"])
    assert "view_count: 2" in server.journal.run(f"share show {made['id']}", user).text


def test_a_link_that_never_ends_opens_and_says_so(plan_server):
    server, user = plan_server
    made = made_link(server, user, "--ends never")
    assert status_of(server, made["link"]) == 200
    session = json.loads(viewer_answer(server.viewer_port(), "/api/session", share_cookie(server, made), "")[2])
    assert session["share"]["ends_at"] is None and session["share"]["comments"] is False, session


def test_a_visitor_comments_through_a_link_that_takes_them(plan_server):
    server, user = plan_server
    made = made_link(server, user, "--comments")
    cookie = share_cookie(server, made)
    status, _, body = viewer_answer(server.viewer_port(), "/api/share/comments", cookie, "", {"name": "--Bo", "text": "--Nice"})
    assert status == 200 and json.loads(body)["rows"][0]["visitor_name"] == "--Bo", body
    assert json.loads(viewer_answer(server.viewer_port(), "/api/share/comments", cookie, "")[2])["rows"][0]["text"] == "--Nice"
    status, _, body = viewer_answer(server.viewer_port(), "/api/share/comments", cookie, "", {"name": "", "text": "x"})
    assert status == 409 and "a name of up to 40" in body, body


def test_a_shared_document_reads_to_its_visitor_and_no_other_does(plan_server):
    server, user = plan_server
    journal = server.journal
    assert "doc 1: The cart rules" in journal.run('doc make "The cart rules" --abstract "How the cart counts" --body "Totals are in cents" --environment main', user).text
    assert "doc 2: Secret plans" in journal.run('doc make "Secret plans" --abstract "Not for visitors" --body "Hidden" --environment main', user).text
    made = json.loads(journal.run("share make docs:1 --json", user).text)
    cookie = share_cookie(server, made)
    assert status_of(server, made["link"]) == 200
    session = json.loads(viewer_answer(server.viewer_port(), "/api/session", cookie, "")[2])
    window = session["share"]["window"]["name"]
    assert session["share"]["row_model"] == "doc" and window == "documents.page", session
    line = {"window": window, "line": ["doc", "show", "1"], "environment": session["share"]["environment"]}
    status, _, body = viewer_answer(server.viewer_port(), "/api/line", cookie, "", line)
    assert status == 200 and "Totals are in cents" in body, body
    _, _, body = viewer_answer(server.viewer_port(), "/api/line", cookie, "", {**line, "line": ["doc", "show", "2"]})
    assert "Hidden" not in body
