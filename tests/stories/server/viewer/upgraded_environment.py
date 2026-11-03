from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story
from tests.stories.fixtures.viewer_environment import prepare_viewer_environment
from tests.stories.server.support.server_client import server_story


def test_a_fresh_upgrade_opens_main_when_another_environment_shares_its_folder(new_story):
    journal_story = upgraded_story(new_story, prepare=prepare_viewer_environment)
    with server_story(journal_story) as story:
        key = story.expect_viewer_key_environment("Jesse", str(journal_story.home.folder.parent), "main")
        cookie = story.expect_viewer_login(key)
        story.expect_viewer_status("/api/session", 200, cookie, text='"type": "person"')
