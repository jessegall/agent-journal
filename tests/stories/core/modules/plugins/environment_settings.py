import json

import pytest

from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.plugins.support.plugin_samples import sample_plugin_folder
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client


@pytest.fixture
def configured_plugin(new_story):
    story = install_runner(new_story(fixture=BuilderWithUser))
    folder = sample_plugin_folder(story.home.folder.parent)
    program = folder / "run.sh"
    program.write_text(program.read_text().replace('line=$(cat)', 'line=$(cat)\nprintf "%s\\n" "$line" >> "$JOURNAL_PLUGIN_DATA/inputs"'))
    with viewer_client(story) as viewer:
        viewer.value("plugins.plugins", ["plugin", "install", str(folder), "--yes"])
        viewer.value("settings.settings", ["setting", "set", "journal.core.plugins.hold_window_ms", "5000", "--project"])
        viewer.value("plugins.plugins", ["plugin", "configure", "sample", "level", "2"])
        viewer.value("viewer.shell", ["environment", "make", "sandbox", "/work/sandbox", "--test", "--test-agent-id", str(story.agent.id)])
        viewer.server.viewer_line_value(viewer.cookie, {"window": "plugins.plugins", "environment": "sandbox",
                                                        "line": ["plugin", "configure", "sample", "level", "3", "--environment", "sandbox"]})
    return story


def test_each_environment_sends_its_own_setting_to_the_plugin(configured_plugin):
    story = configured_plugin
    sample = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, []))
    story.expect_hook_allowed("s-1", sample)
    story.expect_success("agent start s-9 claude main --environment sandbox", actor=story.agent)
    story.expect_hook_allowed("s-9", sample.with_fields(environment="sandbox"))
    inputs = [json.loads(line) for line in (story.home.folder / "plugin-data" / "sample" / "inputs").read_text().splitlines()]
    events = [line for line in inputs if line["event"] == "command_starting"]
    story.expect_rows(any(line["environment"] == "main" and line["settings"]["level"] == 2 for line in events),
                      any(line["environment"] == "sandbox" and line["settings"]["level"] == 3 for line in events), detail=repr(events))


def test_the_granted_agent_can_configure_only_its_test_environment(configured_plugin):
    story = configured_plugin
    story.expect_success("plugin configure sample level 4 --environment sandbox", actor=story.agent)
    story.expect_refusal("plugin configure sample level 5 --environment main", "only in its granted test environment", actor=story.agent)
    story.expect_refusal("plugin configure sample level 5", "only in its granted test environment", actor=story.agent)
