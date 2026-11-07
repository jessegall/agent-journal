from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_the_tasks_dialog_adds_no_padding_around_its_window(new_story):
    with server_story(new_story(fixture=BuilderWithUser)) as server:
        expect_browser(server, "tasksDialog.browser.mjs", [])
