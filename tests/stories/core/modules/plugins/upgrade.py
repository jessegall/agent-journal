from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story


def test_an_installed_version_4_plugin_keeps_its_release_its_switch_and_its_settings(new_story):
    story = upgraded_story(new_story)
    story.expect_text("plugin list", "code-commandments", "on", "v6.26.0")
    assert "journal.core.plugins: moved 1" in story.upgrade_text
