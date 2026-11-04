import pytest

import base64
import http.client
import json

from tests.stories.server.support.server_client import ServerStory, server_story, viewer_answer
from tests.stories.server.viewer.share import plan_server
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_lines, expect_value, expect_value_with, expect_value_without

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
    expect_viewer_answer(story, accepted, "", "", 200)


def test_a_locked_link_asks_for_its_password_and_a_guessed_cookie_opens_nothing(plan_server):
    story = plan_server
    made = made_link(story, "--password open-sesame")
    status, headers, _ = viewer_answer(story.viewer_port(), made["link"], "", "")
    expect_value(status, 401)
    expect_www_authenticate_headers_with(headers, "Basic")
    expect_viewer_answer_3(story, "/api/session", f"journal_share={made['token']}", "", 401)
    expect_with_password(story, made, "wrong", 401)
    status, headers = with_password(story, made["link"], "open-sesame")
    expect_value(status, 200)
    expect_startswith_cookie_headers(headers, "journal_share=")
    expect_viewer_answer_4(story, "/api/session", headers, ";", "", 200)
    expect_viewer_answer_3(story, "/api/session", f"journal_share={made['token']}", "", 401)
    expect_viewer_answer(story, made, "", "", 401)


def test_five_wrong_passwords_lock_the_address_out(plan_server):
    story = plan_server
    made = made_link(story, "--password open-sesame")
    for _ in range(5):
        expect_with_password(story, made, "wrong", 401)
    expect_with_password(story, made, "open-sesame", 429)


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
    expect_viewer_answer(story, made, "", "", 200)
    session = json.loads(viewer_answer(story.viewer_port(), "/api/session", cookie, "")[2])
    expect_row(session["share"], ends_at=None)
    expect_row(session["share"], comments=False)


def test_a_visitor_comments_through_a_link_that_takes_them(plan_server):
    story = plan_server
    made = made_link(story, "--comments")
    cookie = f"journal_share={made['token']}"
    status, _, body = viewer_answer(story.viewer_port(), "/api/share/comments", cookie, "", {"name": "--Bo", "text": "--Nice"})
    expect_value(status, 200)
    expect_visitor(body, "--Bo")
    expect_row(json.loads(viewer_answer(story.viewer_port(), "/api/share/comments", cookie, "")[2])["rows"][0], text="--Nice")
    status, _, body = viewer_answer(story.viewer_port(), "/api/share/comments", cookie, "", {"name": "", "text": "x"})
    expect_value(status, 409)
    expect_value_with(body, "a name of up to 40")


def test_a_link_without_comments_gives_no_way_in(plan_server):
    story = plan_server
    made = made_link(story)
    cookie = f"journal_share={made['token']}"
    expect_viewer_answer_3(story, "/api/share/comments", cookie, "", 403)
    expect_viewer_answer_2(story, "/api/share/comments", cookie, "", "name", "text", "Bo", "x", 403)


def test_a_shared_document_reads_to_its_visitor_and_no_other_does(plan_server):
    story = plan_server
    story.expect_viewer_login(story.viewer_key("Ada"))
    user = story.story.user
    story.story.expect_text('doc make "The cart rules" --abstract "How the cart counts" --body "Totals are in cents" --environment main', "doc 1: The cart rules", actor=user)
    shared = 1
    story.story.expect_text('doc make "Secret plans" --abstract "Not for visitors" --body "Hidden" --environment main', "doc 2: Secret plans", actor=user)
    second = 2
    made = json.loads(story.story.run(f"share make docs:{shared} --json", actor=user, environment_id=1).output_text)
    cookie = f"journal_share={made['token']}"
    expect_viewer_answer(story, made, "", "", 200)
    session = json.loads(viewer_answer(story.viewer_port(), "/api/session", cookie, "")[2])
    window = session["share"]["window"]["name"]
    expect_model_share_session(session, "doc")
    expect_value(window, "documents.documents")
    line = {"window": window, "line": ["doc", "show", str(shared)], "environment": session["share"]["environment"]}
    status, _, body = viewer_answer(story.viewer_port(), "/api/line", cookie, "", line)
    expect_value(status, 200)
    expect_value_with(body, "Totals are in cents")
    status, _, body = viewer_answer(story.viewer_port(), "/api/line", cookie, "", {**line, "line": ["doc", "show", str(second)]})
    expect_value_without(body, "Hidden")


def test_wrong_passwords_on_one_link_leave_another_link_open(plan_server):
    story = plan_server
    first = made_link(story, "--password open-sesame")
    second = json.loads(story.story.run("share make plans:1 --password other-word --json", actor=story.story.user).output_text)
    statuses = [with_password(story, first["link"], "wrong")[0] for _ in range(6)]
    expect_lines(statuses, 1, 429)
    expect_with_password(story, second, "other-word", 200)


def expect_with_password(story, second, text, expected) -> None:
    actual = with_password(story, second['link'], text)[0]
    assert actual == expected, actual


def expect_model_share_session(session, expected) -> None:
    actual = session['share']['row_model']
    assert actual == expected, actual


def expect_viewer_answer(story, made, text, text_2, expected) -> None:
    actual = viewer_answer(story.viewer_port(), made['link'], text, text_2)[0]
    assert actual == expected, actual


def expect_viewer_answer_2(story, text, cookie, text_2, text_3, text_4, text_5, text_6, expected) -> None:
    actual = viewer_answer(story.viewer_port(), text, cookie, text_2, {text_3: text_5, text_4: text_6})[0]
    assert actual == expected, actual


def expect_viewer_answer_3(story, text, cookie, text_2, expected) -> None:
    actual = viewer_answer(story.viewer_port(), text, cookie, text_2)[0]
    assert actual == expected, actual


def expect_visitor(body, expected) -> None:
    actual = json.loads(body)['rows'][0]['visitor_name']
    assert actual == expected, actual


def expect_viewer_answer_4(story, text, headers, text_2, text_3, expected) -> None:
    actual = viewer_answer(story.viewer_port(), text, headers['Set-Cookie'].split(text_2)[0], text_3)[0]
    assert actual == expected, actual


def expect_startswith_cookie_headers(headers, text) -> None:
    actual = headers['Set-Cookie'].startswith(text)
    assert actual, actual


def expect_www_authenticate_headers_with(headers, expected) -> None:
    actual = headers['WWW-Authenticate']
    assert expected in actual, actual
