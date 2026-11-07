import http.client
import json

import pytest

from core.base.viewer.window_key import WindowKey
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story

WINDOW = "messages.chat"
DOCK_TYPE = "tasks.task"


def window_data(server, cookie: str, keys: str = "", window: str = WINDOW, query: str = "environment=main") -> tuple[int, dict[str, object]]:
    connection = http.client.HTTPConnection("127.0.0.1", server.viewer_port(), timeout=10)
    headers = {"Cookie": cookie, "Host": f"127.0.0.1:{server.viewer_port()}"}
    if window:
        headers["x-journal-window"] = window
    if keys:
        headers["x-journal-data-only"] = keys
    connection.request("GET", f"/api/window?{query}", headers=headers)
    response = connection.getresponse()
    return response.status, json.loads(response.read())


class ChatWithMessage(StoryFixture):
    """A person and a message in the chat."""

    parent = UserJoined

    def steps(self, story):
        story.expect_success('message send "Hello" --environment main', actor=story.user)


@pytest.fixture
def chat(new_story):
    story = new_story(fixture=ChatWithMessage)
    with server_story(story) as server:
        yield server, server.expect_viewer_login(server.viewer_key("Ada"))


def test_a_window_with_no_data_only_header_gets_the_keys_on_screen_and_what_it_declares(chat):
    server, cookie = chat
    story = server.story
    status, answer = window_data(server, cookie)
    story.expect_rows(status == 200, set(answer["keys"]) == {"messages", "marks", "docks", "pins", "mark-motion", "voice-profile", "voice-avatar", "voice-avatar-shown"},
                      answer["keys"]["messages"]["code"] == 0, answer["keys"]["messages"]["value"]["rows"][0]["text"] == "Hello",
                      answer["declared"]["messages"]["events"] == ["message.*"])


def test_the_data_only_header_runs_only_those_keys(chat):
    server, cookie = chat
    story = server.story
    status, answer = window_data(server, cookie, keys="pins,docks")
    story.expect_rows(status == 200, set(answer["keys"]) == {"pins", "docks"})


def test_a_state_argument_reaches_only_its_own_key(chat):
    server, cookie = chat
    story = server.story
    status, answer = window_data(server, cookie, keys="messages", query="environment=main&messages.limit=1")
    story.expect_rows(status == 200, len(answer["keys"]["messages"]["value"]["rows"]) == 1)


def test_a_request_without_a_known_window_or_key_is_refused(chat):
    server, cookie = chat
    story = server.story
    story.expect_rows(window_data(server, cookie, window="")[0] == 400, window_data(server, cookie, window="no.window")[0] == 400,
                      window_data(server, cookie, keys="nothing")[0] == 400, window_data(server, cookie, query="tab=x")[0] == 400)


def test_a_key_that_fails_leaves_the_others(chat):
    server, cookie = chat
    story = server.story
    status, answer = window_data(server, cookie, keys="messages,pins", query="environment=main&messages.limit=notanumber")
    story.expect_rows(status == 200, answer["keys"]["messages"]["code"] != 0, answer["keys"]["pins"]["code"] == 0)


def test_no_session_is_refused(chat):
    server, _ = chat
    server.story.expect_rows(window_data(server, "", keys="pins")[0] == 401)


def test_a_docked_card_reads_its_type_first_read_of_its_target_under_its_own_key(chat):
    server, cookie = chat
    story = server.story
    task = story.new_row_id('task make "Docked work" --environment main', actor=story.user)
    item = story.new_row_id(f"dock-item make 1 {DOCK_TYPE} task {task} --environment main --skip-guard docking.item-title --skip-reason 'the title is not what this story reads'", actor=story.user)
    status, answer = window_data(server, cookie, keys=f"dock.{item}")
    story.expect_rows(status == 200, answer["keys"][f"dock.{item}"]["value"]["title"] == "Docked work",
                      f"dock.{item}" not in window_data(server, cookie)[1]["keys"])


def test_a_key_with_an_id_fills_its_line_and_needs_a_number(chat):
    server, cookie = chat
    story = server.story
    status, answer = window_data(server, cookie, keys="question.77,run.77")
    story.expect_rows(status == 200, answer["keys"]["question.77"]["code"] != 0, "77" in answer["keys"]["run.77"]["error"],
                      window_data(server, cookie, keys="dock.all")[0] == 400)


def test_a_key_with_named_ids_takes_a_name_and_never_a_flag(chat):
    server, _ = chat
    key = WindowKey("plugin.*", "plugin show {id}", name_ids=True)
    server.story.expect_rows(key.with_id("plugin.tidy-worktrees").read == "plugin show tidy-worktrees", key.with_id("plugin.--help") is None,
                             WindowKey("run.*", "process card {id}").with_id("run.name") is None)
    source_key = WindowKey("plugin-preview", "plugin preview {source}")
    server.story.expect_rows(source_key.line({"plugin-preview.source": "/a folder/plugin"}) == ["plugin", "preview", "/a folder/plugin"])
