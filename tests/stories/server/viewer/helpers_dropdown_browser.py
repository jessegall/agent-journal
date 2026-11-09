from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_helpers_dropdown_keeps_its_width_when_a_long_name_is_opened(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    helper = story.new_row_id(f"agent start long-helper claude helper --parent {story.agent.id} --environment main")
    story.expect_success(f'agent edit {helper} --given-name "A helper with a very long name that must fit in the dropdown"')
    with server_story(story) as server:
        expect_browser(server, "helpersDropdown.browser.mjs", [str(helper)])
