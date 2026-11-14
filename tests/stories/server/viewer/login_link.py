import json
from urllib.parse import urlsplit

import pytest

from server.enums.session_type import SessionType
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story, viewer_answer


def link_path(link: str) -> str:
    parts = urlsplit(link)
    return f"{parts.path}?{parts.query}"


@pytest.fixture
def viewer(new_story):
    story = new_story(fixture=UserJoined)
    with server_story(story) as server:
        yield story, server


def test_a_browser_with_no_session_gets_a_page_that_says_how_to_log_in(viewer):
    story, server = viewer
    status, headers, body = viewer_answer(server.viewer_port(), "/", "", "")
    story.expect_rows(status == 401, headers["Content-Type"].startswith("text/html"), "not logged in" in body, "Log in another browser" in body, not body.lstrip().startswith("{"))
    api_status, _, api_body = viewer_answer(server.viewer_port(), "/api/session", "", "")
    story.expect_rows(api_status == 401, "error" in json.loads(api_body))


def test_a_person_gets_a_link_from_the_viewer_and_it_logs_another_browser_in_once(viewer):
    story, server = viewer
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    status, _, body = viewer_answer(server.viewer_port(), "/api/login-link", cookie, "", {})
    link = json.loads(body)["link"]
    story.expect_rows(status == 200, link.startswith(f"http://127.0.0.1:{server.viewer_port()}/?key="))
    opened, headers, _ = viewer_answer(server.viewer_port(), link_path(link), "", "")
    alternate = headers["Set-Cookie"].split(";", 1)[0]
    story.expect_rows(opened == 303, "HttpOnly" in headers["Set-Cookie"])
    session_status, _, session = viewer_answer(server.viewer_port(), "/api/session", alternate, "")
    story.expect_rows(session_status == 200, json.loads(session)["person_id"] == json.loads(viewer_answer(server.viewer_port(), "/api/session", cookie, "")[2])["person_id"])
    second, _, page = viewer_answer(server.viewer_port(), link_path(link), "", "")
    story.expect_rows(second == 401, "spent or unknown" in page, "Log in another browser" in page)


def test_an_agents_viewer_session_is_refused_the_login_link(viewer):
    story, server = viewer
    cookie = server.expect_viewer_login(server.context.viewer.login.new_key(story.agent.id, SessionType.AGENT))
    status, _, body = viewer_answer(server.viewer_port(), "/api/login-link", cookie, "", {})
    story.expect_rows(status == 403, "only a user" in body, "link" not in json.loads(body))
