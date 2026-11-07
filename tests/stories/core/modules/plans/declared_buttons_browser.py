from tests.stories.core.modules.demo.support.demo_fixtures import Demonstrated
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_plan_buttons_on_the_demo_and_a_phone(new_story, tmp_path):
    story = new_story(fixture=Demonstrated)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    with server_story(story) as server:
        expect_browser(server, "declaredPlanButtons.browser.mjs", [str(server.socket_path), str(tmp_path / "plan-buttons-phone.png")], login_name="Demo")
