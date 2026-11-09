from tests.stories.server.support.server_fixtures import person_server

import pytest

from tests.stories.core.modules.viewer.support.window_samples import NOTES
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story

SANDBOX_POLICY = "sandbox allow-scripts; default-src 'none'"


def test_a_module_file_outside_its_web_dist_is_refused(notes_server):
    story = notes_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    story.expect_viewer_status("/modules/notes/../../window_samples.py", 404, cookie)


def test_a_frame_windows_file_is_served_with_its_type_nosniff_and_the_sandbox_policy(notes_server):
    story = notes_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    story.expect_viewer_headers("/modules/notes/board.html", cookie, {"Content-Type": "text/html", "X-Content-Type-Options": "nosniff", "Cache-Control": "no-cache",
                                                                     "Content-Security-Policy": SANDBOX_POLICY})


def test_an_unknown_environment_is_answered_with_its_reason(notes_server):
    story = notes_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    story.expect_viewer_status("/api/windows?environment=nowhere", 404, cookie, text="no environment named nowhere")

def test_a_frame_window_reads_nothing_until_the_person_allows_its_reads(notes_server):
    story = notes_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    line = {"window": "notes.board", "line": ["task", "list"], "environment": "main"}
    story.expect_viewer_line(cookie, line, 200, "notes.board may run task list once you allow it")
    story.story.run("window allow notes.board --type reads --environment main", actor=story.story.user)
    story.expect_viewer_line(cookie, line, 200, '"code": 0')


def test_a_frame_loads_its_own_files_and_the_bridge_without_the_session_cookie_from_any_origin(notes_server):
    story = notes_server
    story.expect_viewer_headers("/modules/notes/board.html", "", {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"})
    story.expect_viewer_headers("/viewer/kit/frame-bridge.js", "", {"Content-Type": "text/javascript", "Access-Control-Allow-Origin": "*"})
    story.expect_viewer_status("/viewer/", 401)


def test_the_tasks_window_offers_ten_tasks_a_page_among_a_few_fixed_choices(person_server):
    story = person_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    story.expect_viewer_status("/api/windows?environment=main", 200, cookie,
                               text='{"choices": [["5", "5"], ["10", "10"], ["25", "25"], ["50", "50"]], "control": "choice", "default": "10", "key": "rows", "label": "Tasks per page"}')


@pytest.fixture
def notes_server(new_story):
    with server_story(new_story(NOTES, fixture=UserJoined)) as story:
        yield story
