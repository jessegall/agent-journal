from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_a_document_collapsed_by_the_user_stays_collapsed_until_reopened_in_the_browser(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success('doc make "Project" --abstract "Project context" --body "Keep the project notes here." --environment main', actor=story.user)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    story.run_listeners()
    with server_story(story) as server:
        expect_browser(server, "dockCollapse.browser.mjs", ["/tmp/journal-worker-450-dock-collapse.png"])
