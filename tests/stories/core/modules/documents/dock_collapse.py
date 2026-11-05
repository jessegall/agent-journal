import pytest

from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story

pytestmark = pytest.mark.browser_job


def test_a_document_stays_on_two_lines_and_its_open_button_shows_the_whole_text(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success('doc make "Project" --abstract "Project context" --body "Keep the project notes here." --environment main', actor=story.user)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    story.run_listeners()
    with server_story(story) as server:
        expect_browser(server, "dockCollapse.browser.mjs", ["/tmp/journal-worker-450-dock-collapse.png"])
