import base64
import http.client
import json

from tests.stories.server.support.server_client import ServerStory, server_story, viewer_answer
from tests.stories.server.viewer.share import PlanAndPersonFixture

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


def test_a_waiting_link_opens_nothing_until_it_is_accepted(new_story):
    with server_story(new_story(fixture=PlanAndPersonFixture)) as story:
        story.expect_viewer_login(story.viewer_key("Ada"))
        story.story.run("share make plans:1 --environment main", actor=story.story.agent)
        accepted = json.loads(story.story.run("share accept 1 --json", actor=story.story.user).output_text)
        assert viewer_answer(story.viewer_port(), accepted["link"], "", "")[0] == 200


def test_a_locked_link_asks_for_its_password_and_a_guessed_cookie_opens_nothing(new_story):
    with server_story(new_story(fixture=PlanAndPersonFixture)) as story:
        made = made_link(story, "--password open-sesame")
        status, headers, _ = viewer_answer(story.viewer_port(), made["link"], "", "")
        assert status == 401 and "Basic" in headers["WWW-Authenticate"], (status, headers)
        assert viewer_answer(story.viewer_port(), "/api/session", f"journal_share={made['token']}", "")[0] == 401
        assert with_password(story, made["link"], "wrong")[0] == 401
        status, headers = with_password(story, made["link"], "open-sesame")
        assert status == 200 and headers["Set-Cookie"].startswith("journal_share="), (status, headers)
        assert viewer_answer(story.viewer_port(), "/api/session", f"journal_share={made['token']}", "")[0] == 200


def test_five_wrong_passwords_lock_the_address_out(new_story):
    with server_story(new_story(fixture=PlanAndPersonFixture)) as story:
        made = made_link(story, "--password open-sesame")
        for _ in range(5):
            assert with_password(story, made["link"], "wrong")[0] == 401
        assert with_password(story, made["link"], "open-sesame")[0] == 429


def test_each_opening_counts_as_a_view(new_story):
    with server_story(new_story(fixture=PlanAndPersonFixture)) as story:
        made = made_link(story)
        viewer_answer(story.viewer_port(), made["link"], "", "")
        viewer_answer(story.viewer_port(), made["link"], "", "")
        story.story.expect_success(f"share show {made['id']}", "view_count: 2", actor=story.story.user)


def test_a_link_that_never_ends_opens_and_says_so(new_story):
    with server_story(new_story(fixture=PlanAndPersonFixture)) as story:
        made = made_link(story, "--ends never")
        cookie = f"journal_share={made['token']}"
        assert viewer_answer(story.viewer_port(), made["link"], "", "")[0] == 200
        session = json.loads(viewer_answer(story.viewer_port(), "/api/session", cookie, "")[2])
        assert session["share"]["ends_at"] is None and session["share"]["comments"] is False, session


def test_a_visitor_comments_through_a_link_that_takes_them(new_story):
    with server_story(new_story(fixture=PlanAndPersonFixture)) as story:
        made = made_link(story, "--comments")
        cookie = f"journal_share={made['token']}"
        status, _, body = viewer_answer(story.viewer_port(), "/api/share/comments", cookie, "", {"name": "--Bo", "text": "--Nice"})
        assert status == 200 and json.loads(body)["rows"][0]["visitor_name"] == "--Bo", (status, body)
        assert json.loads(viewer_answer(story.viewer_port(), "/api/share/comments", cookie, "")[2])["rows"][0]["text"] == "--Nice"
        status, _, body = viewer_answer(story.viewer_port(), "/api/share/comments", cookie, "", {"name": "", "text": "x"})
        assert status == 409 and "a name of up to 40" in body, (status, body)


def test_a_link_without_comments_gives_no_way_in(new_story):
    with server_story(new_story(fixture=PlanAndPersonFixture)) as story:
        made = made_link(story)
        cookie = f"journal_share={made['token']}"
        assert viewer_answer(story.viewer_port(), "/api/share/comments", cookie, "")[0] == 403
        assert viewer_answer(story.viewer_port(), "/api/share/comments", cookie, "", {"name": "Bo", "text": "x"})[0] == 403
