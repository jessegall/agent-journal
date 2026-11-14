from engine.actor.actor import Actor
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.modules.templates.commands.save_standard_templates.save_standard_templates import SaveStandardTemplates
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED


def test_a_template_made_in_the_dialog_can_be_edited_and_a_published_one_offers_no_edit(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(f"setting set {TOUR_COMPLETED} true --project")
    story.run_command(SaveStandardTemplates(), Actor.core(), 1)
    story.expect_text("template list", "General critique", actor=story.user)
    with server_story(story) as server:
        expect_browser(server, "templates.browser.mjs", [])
