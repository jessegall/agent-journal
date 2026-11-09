import os
import subprocess
import time
from pathlib import Path

from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.browser_story import VIEWER_FOLDER
from tests.stories.server.support.server_client import server_story
from tests.stories.support.story_checks import expect_value

WAIT_SECONDS = 60
BROWSER_SECONDS = 90


def test_the_chat_scroll_position_only_grows_after_a_send_and_after_an_arrival(new_story, tmp_path):
    story = new_story(fixture=UserBuilder)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    for number in range(1, 31):
        story.expect_success(f'message send "Backlog message {number}" --environment main', actor=story.user)
    picture = tmp_path / "chat-scroll.png"
    ready = Path(f"{picture}.ready")
    with server_story(story) as server:
        address = f"http://127.0.0.1:{server.viewer_port()}/?key={server.viewer_key('Ada')}&environment=main"
        browser = subprocess.Popen(["node", "tests/chatScroll.browser.mjs", address, str(picture)], cwd=VIEWER_FOLDER, text=True,
                                   stdout=subprocess.PIPE, stderr=subprocess.STDOUT, env={**os.environ})
        deadline = time.monotonic() + WAIT_SECONDS
        while not ready.exists() and browser.poll() is None and time.monotonic() < deadline:
            time.sleep(0.05)
        story.expect_success('message send "A message from the agent" --environment main', actor=story.agent)
        output, _ = browser.communicate(timeout=BROWSER_SECONDS)
    expect_value(browser.returncode, 0)
