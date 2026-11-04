import pytest

import base64
import http.client
import json

from tests.stories.server.support.server_client import ServerStory, server_story, viewer_answer
from tests.stories.server.viewer.share import plan_server
from core.testing.expect_row import expect_row

TIMEOUT_SECONDS = 10


def made_link(story: ServerStory, options: str = "") -> dict:
    story.expect_viewer_login(story.viewer_key("Ada"))
    return json.loads(story.story.run(f"share make plans:1 {options} --json", actor=story.story.user).output_text)


def with_password(story: ServerStory, path: str, password: str) -> tuple[int, dict[str, str]]:
    connection = http.client.HTTPConnection("127.0.0.1", story.viewer_port(), timeout=TIMEOUT_SECONDS)
    encoded = base64.b64encode(f"any:{password}".encode()).decode()
    try:
        connection.request("GET", path, headers={"Host": f"127.0.0.1:{story.viewer_port()}", "Authorization": f"Basic {encoded}"})
        response = connection.getresponse()
        response.read()
        return response.status, dict(response.getheaders())
    finally:
        connection.close()


def test_a_waiting_link_opens_nothing_until_it_is_accepted(plan_server):
    story = plan_server
    story.expect_viewer_login(story.viewer_key("Ada"))
    request = json.loads(story.story.run("share make plans:1 --environment main --json", actor=story.story.agent).output_text)
    expect_row(request, token=None)
    expect_row(request, link=None)
    accepted = json.loads(story.story.run("share accept 1 --json", actor=story.story.user).output_text)
    assert viewer_answer(story.viewer_port(), accepted["link"], "", "")[0] == 200


def test_a_locked_link_asks_for_its_password_and_a_guessed_cookie_opens_nothing(plan_server):
    story = plan_server
    made = made_link(story, "--password open-sesame")
    status, headers, _ = viewer_answer(story.viewer_port(), made["link"], "", "")
    assert status == 401 and "Basic" in headers["WWW-Authenticate"], (status, headers)
    assert viewer_answer(story.viewer_port(), "/api/session", f"journal_share={made['token']}", "")[0] == 401
    assert with_password(story, made["link"], "wrong")[0] == 401
    status, headers = with_password(story, made["link"], "open-sesame")
    assert status == 200 and headers["Set-Cookie"].startswith("journal_share="), (status, headers)
    assert viewer_answer(story.viewer_port(), "/api/session", headers["Set-Cookie"].split(";")[0], "")[0] == 200
    assert viewer_answer(story.viewer_port(), "/api/session", f"journal_share={made['token']}", "")[0] == 401
    assert viewer_answer(story.viewer_port(), made["link"], "", "")[0] == 401


def test_five_wrong_passwords_lock_the_address_out(plan_server):
    story = plan_server
    made = made_link(story, "--password open-sesame")
    for _ in range(5):
        assert with_password(story, made["link"], "wrong")[0] == 401
    assert with_password(story, made["link"], "open-sesame")[0] == 429


def test_each_opening_counts_as_a_view(plan_server):
    story = plan_server
    made = made_link(story)
    viewer_answer(story.viewer_port(), made["link"], "", "")
    viewer_answer(story.viewer_port(), made["link"], "", "")
    story.story.expect_success(f"share show {made['id']}", "view_count: 2", actor=story.story.user)


def test_a_link_that_never_ends_opens_and_says_so(plan_server):
    story = plan_server
    made = made_link(story, "--ends never")
    cookie = f"journal_share={made['token']}"
    assert viewer_answer(story.viewer_port(), made["link"], "", "")[0] == 200
    session = json.loads(viewer_answer(story.viewer_port(), "/api/session", cookie, "")[2])
    expect_row(session["share"], ends_at=None)
    expect_row(session["share"], comments=False)


def test_a_visitor_comments_through_a_link_that_takes_them(plan_server):
    story = plan_server
    made = made_link(story, "--comments")
    cookie = f"journal_share={made['token']}"
    status, _, body = viewer_answer(story.viewer_port(), "/api/share/comments", cookie, "", {"name": "--Bo", "text": "--Nice"})
    assert status == 200 and json.loads(body)["rows"][0]["visitor_name"] == "--Bo", (status, body)
    expect_row(json.loads(viewer_answer(story.viewer_port(), "/api/share/comments", cookie, "")[2])["rows"][0], text="--Nice")
    status, _, body = viewer_answer(story.viewer_port(), "/api/share/comments", cookie, "", {"name": "", "text": "x"})
    assert status == 409 and "a name of up to 40" in body, (status, body)


def test_a_link_without_comments_gives_no_way_in(plan_server):
    story = plan_server
    made = made_link(story)
    cookie = f"journal_share={made['token']}"
    assert viewer_answer(story.viewer_port(), "/api/share/comments", cookie, "")[0] == 403
    assert viewer_answer(story.viewer_port(), "/api/share/comments", cookie, "", {"name": "Bo", "text": "x"})[0] == 403


def test_a_shared_document_reads_to_its_visitor_and_no_other_does(plan_server):
    story = plan_server
    story.expect_viewer_login(story.viewer_key("Ada"))
    user = story.story.user
    story.story.expect_text('doc make "The cart rules" --abstract "How the cart counts" --body "Totals are in cents" --environment main', "doc 1: The cart rules", actor=user)
    shared = 1
    story.story.expect_text('doc make "Secret plans" --abstract "Not for visitors" --body "Hidden" --environment main', "doc 2: Secret plans", actor=user)
    second = 2
    made = json.loads(story.story.run(f"share make docs:{shared} --json", actor=user).output_text)
    cookie = f"journal_share={made['token']}"
    assert viewer_answer(story.viewer_port(), made["link"], "", "")[0] == 200
    session = json.loads(viewer_answer(story.viewer_port(), "/api/session", cookie, "")[2])
    window = session["share"]["window"]["name"]
    assert session["share"]["row_model"] == "doc" and window == "documents.documents", session
    line = {"window": window, "line": ["doc", "show", str(shared)], "environment": session["share"]["environment"]}
    status, _, body = viewer_answer(story.viewer_port(), "/api/line", cookie, "", line)
    assert status == 200 and "Totals are in cents" in body, (status, body)
    status, _, body = viewer_answer(story.viewer_port(), "/api/line", cookie, "", {**line, "line": ["doc", "show", str(second)]})
    assert "Hidden" not in body, (status, body)


def test_wrong_passwords_on_one_link_leave_another_link_open(plan_server):
    story = plan_server
    first = made_link(story, "--password open-sesame")
    second = json.loads(story.story.run("share make plans:1 --password other-word --json", actor=story.story.user).output_text)
    statuses = [with_password(story, first["link"], "wrong")[0] for _ in range(6)]
    assert statuses[-1] == 429, statuses
    assert with_password(story, second["link"], "other-word")[0] == 200


