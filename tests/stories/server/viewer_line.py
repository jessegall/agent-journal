from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story


def test_a_line_that_names_no_window_is_refused(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        cookie = story.expect_viewer_login(story.viewer_key("Ada"))
        story.expect_viewer_line(cookie, {"line": ["environment", "list"], "environment": "main"}, 400, "every line names the window that sends it")


def test_a_line_outside_the_windows_declaration_is_refused(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        cookie = story.expect_viewer_login(story.viewer_key("Ada"))
        story.expect_viewer_line(cookie, {"window": "viewer.shell", "line": ["task", "list"], "environment": "main"}, 200, '"code": 1')


def test_an_abbreviated_flag_is_a_usage_error(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        cookie = story.expect_viewer_login(story.viewer_key("Ada"))
        story.expect_viewer_line(cookie, {"window": "viewer.shell", "line": ["environment", "list", "--js"], "environment": "main"}, 200, '"code": 2')


def test_a_write_from_a_window_is_recorded_as_the_person_at_the_viewer(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        cookie = story.expect_viewer_login(story.viewer_key("Ada"))
        body = {"window": "viewer.shell", "line": ["setting", "make", "viewer.window.shell.compact", "true"], "environment": "main"}
        story.expect_viewer_line(cookie, body, 200, f'"creator_id": {story.story.user.id}')
