from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story

CAPTURE = "/tmp/documents-pane"


def test_the_document_browser_opens_in_a_pane_of_the_home_screen_and_the_sidebar_still_reaches_its_page(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    story.expect_success('doc make "Cart rules" --abstract "How the cart counts money" --body "Intro line"', "doc 1: Cart rules", actor=story.user)
    with server_story(story) as server:
        expect_browser(server, "documentsPane.browser.mjs", [CAPTURE])


def test_a_memory_opened_in_the_side_panel_shows_plain_labels_in_light_and_dark(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success('setting set journal.core.viewer.tour-completed true --project')
    story.expect_success('memory make "Keep the totals in cents" --environment main', actor=story.user)
    with server_story(story) as server:
        expect_browser(server, "memoryPanel.browser.mjs", ["/tmp/memory-panel"])
