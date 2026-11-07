from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story
from tests.stories.core.modules.plugins.hooks import LISTING_SAMPLE
from tests.stories.core.modules.plugins.support.notices import expect_plugin_notice
from tests.stories.core.support.scanned_edits import scanned_edit
from tests.stories.core.modules.plugins.support.plugin_upgrade_report import PLUGIN_REFUSAL_SAMPLE, expect_missing_plugin_report, expect_plugin_upgrade, start_upgraded_plugin_agent
from tests.stories.fixtures.legacy_plugin import disabled_plugin_folder, plugin_folder, upgradable_plugin_folder


def test_an_installed_version_4_plugin_keeps_its_release_its_switch_and_its_settings(new_story):
    story = upgraded_story(new_story, plugin_folder)
    story.expect_text("plugin list", "code-commandments", "on", "v6.26.0")
    expect_plugin_upgrade(story, enabled=True)
    start_upgraded_plugin_agent(story)
    story.expect_hook_refusal("upgraded-plugin", PLUGIN_REFUSAL_SAMPLE, "plugin:1 refused: journal agent-line list")
    story.expect_text(f"agent-line list --agent {story.agent.id}", "[plugin code-commandments] no deletes here", actor=story.agent)
    story.hook("upgraded-plugin", LISTING_SAMPLE)
    scanned_edit(story, "upgraded-plugin", "a.py")
    story.run_listeners()
    expect_plugin_notice(story, LISTING_SAMPLE, "[plugin code-commandments] a.py was judged", session="upgraded-plugin")


def test_a_version_4_plugin_whose_folder_is_gone_moves_switched_off(new_story):
    story = upgraded_story(new_story)
    story.expect_text("plugin list", "code-commandments", "off")
    expect_missing_plugin_report(story)


def test_a_user_disabled_plugin_stays_disabled_after_upgrade(new_story):
    story = upgraded_story(new_story, disabled_plugin_folder)
    expect_plugin_upgrade(story, enabled=False)
    start_upgraded_plugin_agent(story)
    story.expect_hook_allowed("upgraded-plugin", PLUGIN_REFUSAL_SAMPLE)


def test_the_reported_update_commands_preview_and_apply_a_newer_plugin(new_story):
    story = upgraded_story(new_story, upgradable_plugin_folder)
    expect_plugin_upgrade(story, enabled=True)
    story.expect_text("plugin latest code-commandments", "6.27.0")
    story.expect_text("plugin upgrade code-commandments", "6.27.0", "--yes")
    story.expect_text("plugin list", "v6.26.0")
    story.expect_text("plugin upgrade code-commandments --yes", "6.27.0")
    story.expect_text("plugin list", "6.27.0")
    start_upgraded_plugin_agent(story)
    story.expect_hook_refusal("upgraded-plugin", PLUGIN_REFUSAL_SAMPLE, "plugin:1 refused: journal agent-line list")
    story.expect_text(f"agent-line list --agent {story.agent.id}", "[plugin code-commandments] no deletes here", actor=story.agent)
