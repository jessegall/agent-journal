from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story
from tests.stories.core.modules.plugins.support.plugin_upgrade_report import PLUGIN_REFUSAL_SAMPLE, expect_missing_plugin_report, expect_plugin_upgrade, start_upgraded_plugin_agent
from tests.stories.fixtures.legacy_plugin import disabled_plugin_folder, plugin_folder, upgradable_plugin_folder


def test_a_user_disabled_plugin_stays_disabled_after_upgrade(new_story):
    story = upgraded_story(new_story, disabled_plugin_folder)
    expect_plugin_upgrade(story, enabled=False)
    start_upgraded_plugin_agent(story)
    story.expect_hook_allowed("upgraded-plugin", PLUGIN_REFUSAL_SAMPLE)
