import json

from core.base.query.queries import Queries
from core.base.driver.command_category import CommandCategory
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.models.plugin_setting import PluginSetting
from core.testing.hook_samples import HookSamples
from core.testing.story import Story
from core.testing.shell_part import ShellPart
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.fixtures.legacy_plugin import INSTALLED_VERSION, PLUGIN_NAME

PLUGIN_REFUSAL_SAMPLE = HookSamples.shell("touch protected", ShellPart("touch", CommandCategory.EDIT, ["protected"]))


def expect_plugin_upgrade(story: Story, enabled: bool) -> None:
    plugin = next(story.container.get(Queries).query(Plugin).all_rows())
    assert plugin.release == f"v{INSTALLED_VERSION}", plugin
    assert plugin.enabled is enabled, plugin
    settings = {row.key: json.loads(row.value) for row in story.container.get(Queries).query(PluginSetting).filter(plugin_id=plugin.id).all_rows()}
    assert settings == {"folders_judged": ["src"], "judge_parallel": 2}, settings
    text = story.upgrade_text
    assert f"kept plugin {PLUGIN_NAME} v{INSTALLED_VERSION}" in text, "missing retained plugin and release"
    assert "not upgraded automatically" in text, "missing plugin update policy"
    for command in (f"journal plugin latest {PLUGIN_NAME}", f"journal plugin upgrade {PLUGIN_NAME}", f"journal plugin upgrade {PLUGIN_NAME} --yes"):
        assert command in text, command


def expect_missing_plugin_report(story: Story) -> None:
    text = story.upgrade_text
    assert "code-commandments" in text and "folder is missing" in text, "missing folder explanation"
    assert str(story.home.folder / "plugins" / PLUGIN_NAME) in text, "missing folder to restore"
    assert f"journal plugin enable {PLUGIN_NAME}" in text, "missing enable command"


def start_upgraded_plugin_agent(story: Story) -> None:
    install_runner(story)
    story.expect_success("suite choose coding --environment main")
    story.expect_success("setting set journal.core.plugins.hold_window_ms 5000 --project")
    story.agent = hook_agent(story, story.hook("upgraded-plugin", HookSamples.session_start().with_fields(folder=str(story.home.folder.parent))))
    story.run_listeners()
