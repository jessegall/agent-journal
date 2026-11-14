import subprocess

from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import VIEWER_FOLDER
from tests.stories.server.support.server_client import server_story
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED


def test_debug(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(f"setting set {TOUR_COMPLETED} true --project")
    seen = []
    with server_story(story) as server:
        key = server.viewer_key("Ada")
        address = f"http://127.0.0.1:{server.viewer_port()}/?key={key}&environment=main"
        for view in ("templates.templates", "skills.skills"):
            done = subprocess.run(["node", "tests/zzdebug.browser.mjs", address, view], cwd=VIEWER_FOLDER, capture_output=True, text=True, timeout=60)
            seen.append(done.stdout + done.stderr)
    assert False, seen
