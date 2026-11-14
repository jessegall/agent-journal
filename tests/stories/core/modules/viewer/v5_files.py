import subprocess

import pytest

from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.support.scanned_edits import scanned_edit
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED

pytestmark = pytest.mark.real_git


def test_a_file_of_the_feed_opens_in_the_file_inspector_and_the_inspector_opens_the_files_page(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success(f"setting set {TOUR_COMPLETED} true --project")
    repository = repository_environment(story, real_git=True)
    (repository.folder / "src").mkdir()
    (repository.folder / "src" / "cart.py").write_text("def total(items):\n    return sum(items)\n")
    subprocess.run(["git", "add", "-A"], cwd=repository.folder, check=True)
    scanned_edit(story, "s-1", "src/cart.py", 3, 1, folder=repository.folder)
    story.run_listeners()
    story.expect_text(f"file-edit list --agent {story.agent.id}", "src/cart.py", actor=story.agent)
    with server_story(story) as server:
        expect_browser(server, "files.browser.mjs", [str(story.agent.id)])
