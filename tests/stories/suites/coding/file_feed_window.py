import json

import pytest

from core.base.file_access import FileAccess
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.support.scanned_edits import scanned_edit
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment


@pytest.fixture
def file_feed_server(new_story):
    story = new_story(fixture=UserBuilder)
    repository = repository_environment(story)
    file = repository.folder / "cart.py"
    FileAccess.shared().write(file, "TOTAL = 1\n")
    scanned_edit(story, "s-1", "cart.py", 1, 0, folder=repository.folder)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        server.viewer_line_value(cookie, {"window": "coding.file-feed", "environment": "main",
                                          "line": ["window", "save-setting", "coding.file-feed", "view", json.dumps({"headers": True})]})
        yield server, cookie, file


def test_the_feed_reads_its_selected_agents_edits_and_saved_view_together(file_feed_server):
    server, cookie, _ = file_feed_server
    status, answer = window_data(server, cookie, window="coding.file-feed", query=f"environment=main&edits.agent={server.story.agent.id}")
    server.story.expect_rows(status == 200, set(answer["keys"]) == {"edits", "view"})
    server.story.expect_rows(answer["keys"]["view"]["code"] == 0)
    rows = answer["keys"]["edits"]["value"]["rows"]
    server.story.expect_rows(len(rows) == 1, rows[0]["path"] == "cart.py", rows[0]["session_agent_id"] == server.story.agent.id,
                             answer["keys"]["view"]["value"]["value"]["headers"])


def test_the_whole_file_key_reads_the_current_file_by_edit_id(file_feed_server):
    server, cookie, file = file_feed_server
    FileAccess.shared().write(file, "TOTAL = 2\n")
    status, answer = window_data(server, cookie, keys="file.1", window="coding.file-feed")
    server.story.expect_rows(status == 200, set(answer["keys"]) == {"file.1"},
                             answer["keys"]["file.1"]["value"]["text"] == "TOTAL = 2\n")


def test_the_agent_card_feed_key_reads_only_the_named_agents_edits(file_feed_server):
    server, cookie, _ = file_feed_server
    key = f"agent-edits.{server.story.agent.id}"
    status, answer = window_data(server, cookie, keys=key, window="agents.agents")
    rows = answer["keys"][key]["value"]["rows"]
    server.story.expect_rows(status == 200, set(answer["keys"]) == {key}, len(rows) == 1,
                             all(row["session_agent_id"] == server.story.agent.id for row in rows),
                             answer["declared"]["agent-edits.*"]["page_size"] == 50)
