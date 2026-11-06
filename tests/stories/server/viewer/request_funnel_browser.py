from pathlib import Path

import pytest

from tests.stories.core.modules.messages.message_comments import story_with_peer_message
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def run_browser_script(new_story, tmp_path: Path, script: str) -> None:
    story = story_with_peer_message(new_story, tmp_path)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    numbers = tmp_path / "numbers.json"
    try:
        with server_story(story) as server:
            expect_browser(server, script, [str(numbers)])
    finally:
        print(script, numbers.read_text() if numbers.exists() else "no numbers written")


@pytest.mark.parametrize("script", ["eventStreamShared.browser.mjs", "readsJoined.browser.mjs", "sendAtOnce.browser.mjs"])
def test_the_viewer_requests_under_load(new_story, tmp_path, script):
    run_browser_script(new_story, tmp_path, script)


def test_the_request_log_page_opens_without_a_reload(new_story, tmp_path):
    story = story_with_peer_message(new_story, tmp_path)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    story.expect_success("setting switch journal.core.developer.tools on --project", actor=story.user)
    story.expect_success("setting set journal.core.developer.tools.hooks.request-log true --project", actor=story.user)
    with server_story(story) as server:
        expect_browser(server, "requestLogPage.browser.mjs", [])
