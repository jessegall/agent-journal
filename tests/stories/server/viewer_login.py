from tests.stories.server.support.server_fixtures import person_server

import pytest

from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import request_answer, server_story

FOREIGN_HOST = "journal.example.com"


def test_a_viewer_request_without_the_login_cookie_is_refused(person_server):
    story = person_server
    story.expect_viewer_status("/viewer/", 401)


def test_a_login_key_sets_a_cookie_once_and_is_spent(person_server):
    story = person_server
    key = story.viewer_key("Ada")
    story.expect_viewer_login(key)
    story.expect_viewer_status(f"/?key={key}", 401)


def test_a_spent_login_key_opened_again_in_the_logged_in_browser_opens_the_viewer_with_the_query_kept(person_server):
    story = person_server
    key = story.viewer_key("Ada")
    cookie = story.expect_viewer_login(key)
    story.expect_viewer_redirect(f"/?key={key}&environment=main", cookie, "/viewer/?environment=main")


def test_an_unknown_login_key_with_no_session_cookie_is_still_refused(person_server):
    story = person_server
    story.expect_viewer_status("/?key=unknown", 401, cookie="journal_viewer=unknown")


def test_a_login_redirect_keeps_the_query_the_person_opened_and_drops_the_key(person_server):
    story = person_server
    key = story.viewer_key("Ada")
    story.expect_viewer_login_to(key, "&environment=main&agent=3", "/viewer/?environment=main&agent=3")
    story.expect_viewer_login_to(story.viewer_key("Ada"), "", "/viewer/")


def test_the_cookie_opens_the_viewer_shell_with_its_import_map(person_server):
    story = person_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    story.expect_viewer_status("/viewer/", 200, cookie, text='"@journal/window-kit": "/viewer/kit/window-kit.js"')
    story.expect_viewer_headers("/viewer/kit/window-kit.js", cookie, {"Content-Type": "text/javascript"})


def test_a_request_naming_another_host_is_refused_even_with_the_cookie(person_server):
    story = person_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    story.expect_viewer_status("/viewer/", 403, cookie, host=FOREIGN_HOST)


def test_a_worker_gets_no_viewer_key(person_server):
    story = person_server
    story.story.expect_success("agent start s-9 claude worker --environment main")
    story.expect_viewer_key_refusal({"variables": {"JOURNAL_AGENT_SESSION": "s-9"}, "folder": "/"}, 403, "only a person or the main agent opens the viewer")


def test_the_main_agent_opens_the_viewer_as_itself_and_reads_its_windows(person_server):
    story = person_server
    cookie = story.expect_viewer_login(main_agent_key(story))
    rules = story.viewer_line_value(cookie, {"line": ["rule", "list"], "environment": "main", "window": "project-rules.rules"})
    story.story.expect_rows(isinstance(rules, dict))


def test_the_main_agent_in_the_viewer_is_refused_what_only_a_person_may_do(person_server):
    story = person_server
    rule = story.story.new_row_id('rule make "Keep the build green"', actor=story.story.agent)
    cookie = story.expect_viewer_login(main_agent_key(story))
    story.expect_viewer_line(cookie, {"line": ["rule", "approve", str(rule)], "environment": "main", "window": "project-rules.rules"}, 200, "only reads")
    story.story.expect_text(f"rule show {rule}", "state: proposed", actor=story.story.agent)


def main_agent_key(story) -> str:
    answer = request_answer(story.socket_path, "POST", "/viewer/key", {"variables": {"JOURNAL_AGENT_SESSION": "s-1"}, "folder": "/"}).json()
    assert isinstance(answer, dict) and isinstance(answer.get("key"), str), answer
    return answer["key"]


def test_a_viewer_key_request_that_is_not_an_object_is_refused(person_server):
    story = person_server
    story.expect_viewer_key_refusal(["Ada"], 400, "a caller request is an object")



