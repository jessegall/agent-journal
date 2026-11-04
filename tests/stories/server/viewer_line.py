from tests.stories.server.support.server_fixtures import person_server

import pytest

import json

from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story, viewer_answer
from tests.stories.support.story_checks import expect_value, expect_value_with


def test_a_line_that_names_no_window_is_refused(person_server):
    story = person_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    story.expect_viewer_line(cookie, {"line": ["environment", "list"], "environment": "main"}, 400, "every line names the window that sends it")


def test_a_line_outside_the_windows_declaration_is_refused(person_server):
    story = person_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    story.expect_viewer_line(cookie, {"window": "viewer.shell", "line": ["secret", "list"], "environment": "main"}, 200, '"code": 1')


def test_an_abbreviated_flag_is_a_usage_error(person_server):
    story = person_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    story.expect_viewer_line(cookie, {"window": "viewer.shell", "line": ["environment", "list", "--js"], "environment": "main"}, 200, '"code": 2')


def test_a_line_with_words_after_a_flag_separator_keeps_them_as_words(person_server):
    story = person_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    body = {"window": "triggers.triggers", "line": ["trigger", "make", "--do", "deny", "--", "--force", "Never force push"], "environment": "main"}
    story.expect_viewer_line(cookie, body, 200, '"code": 0')


def test_a_write_from_a_window_is_recorded_as_the_person_at_the_viewer(person_server):
    story = person_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    body = {"window": "viewer.shell", "line": ["setting", "make", "viewer.window.shell.compact", "true"], "environment": "main"}
    story.expect_viewer_line(cookie, body, 200, f'"creator_id": {story.story.user.id}')


def test_several_lines_in_one_request_are_answered_in_order_each_checked_on_its_own(person_server):
    story = person_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    body = {"lines": [{"window": "viewer.shell", "line": ["environment", "list"], "environment": "main"},
                      {"window": "viewer.shell", "line": ["secret", "list"], "environment": "main"},
                      {"window": "viewer.shell", "line": ["environment", "list", "--js"], "environment": "main"}]}
    status, _, answer = viewer_answer(story.viewer_port(), "/api/lines", cookie, "", body)
    answers = json.loads(answer)["answers"]
    expect_value(status, 200)
    expect_code_item_answers(answers, [0, 1, 2])


def test_a_lines_request_without_its_list_is_refused(person_server):
    story = person_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    status, _, answer = viewer_answer(story.viewer_port(), "/api/lines", cookie, "", {"line": ["environment", "list"]})
    expect_value(status, 400)
    expect_value_with(answer, "a list of lines")


def expect_code_item_answers(answers, expected) -> None:
    actual = [item['code'] for item in answers]
    assert actual == expected, actual
