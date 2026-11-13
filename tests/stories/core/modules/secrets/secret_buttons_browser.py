from engine.private.private_folder import FOLDER_VARIABLE
from tests.stories.core.modules.secrets.support.secret_fixtures import SecretMade
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED

def test_secret_buttons_name_the_actions_and_save_credentials(new_story, monkeypatch, tmp_path):
    monkeypatch.setenv(FOLDER_VARIABLE, str(tmp_path / "private"))
    story = new_story(fixture=SecretMade)
    story.expect_success(f"setting set {TOUR_COMPLETED} true --project")
    with server_story(story) as server:
        expect_browser(server, "secretButtons.browser.mjs", [])
    story.expect_text("secret show 1", "filled, hidden", actor=story.agent)
