import os
import subprocess
from pathlib import Path

from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.browser_story import VIEWER_FOLDER
from tests.stories.server.support.server_client import server_story
from tests.stories.support.story_checks import expect_value
from tests.stories.server.support.file_changes import FileChanges
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED

WAIT_SECONDS = 60
BROWSER_SECONDS = 90


def test_the_chat_scroll_position_only_grows_after_a_send_and_after_an_arrival(new_story, tmp_path):
    story = new_story(fixture=UserBuilder)
    story.expect_success(f"setting set {TOUR_COMPLETED} true --project")
    for number in range(1, 31):
        story.expect_success(f'message send "Backlog message {number}" --environment main', actor=story.user)
    image = tmp_path / "chat-scroll.png"
    ready = Path(f"{image}.ready")
    with server_story(story) as server:
        address = f"http://127.0.0.1:{server.viewer_port()}/?key={server.viewer_key('Ada')}&environment=main"
        with FileChanges(tmp_path) as changes:
            browser = subprocess.Popen(["node", "tests/chatScroll.browser.mjs", address, str(image)], cwd=VIEWER_FOLDER, text=True,
                                       stdout=subprocess.PIPE, stderr=subprocess.STDOUT, env={**os.environ})
            while not ready.exists() and browser.poll() is None and changes.wait(WAIT_SECONDS):
                continue
        story.expect_success('message send "A message from the agent" --environment main', actor=story.agent)
        output, _ = browser.communicate(timeout=BROWSER_SECONDS)
    expect_value(browser.returncode, 0)
