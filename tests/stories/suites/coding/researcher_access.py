import pytest

from engine.database.database import Database
from engine.enums.command_category import CommandCategory
from engine.enums.tool_type import ToolType
from engine.registry.registry import Registry
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE

READ_FILE = HookSamples.shell("cat src/cart.py", ShellPart("cat", CommandCategory.READ, ["src/cart.py"]))
WEB_READER = HookSamples.tool_use("Agent", ToolType.AGENT, [], None).with_raw({"tool_input": {"subagent_type": "web-fetch"}})
SECOND_AGENT = HookSamples.tool_use("Agent", ToolType.AGENT, [], None).with_raw({"tool_input": {"subagent_type": "general-purpose"}})
WEB_READER_REQUEST = HookSamples.tool_use("WebFetch", ToolType.UNCATEGORISED, [], None).with_fields(child_agent="a77cb613").with_raw({"agent_type": "web-fetch"})
SIBLING_TOOL = HookSamples.tool_use("WebFetch", ToolType.UNCATEGORISED, [], None).with_fields(child_agent="a77cb613").with_raw({"agent_type": "general-purpose"})


@pytest.fixture
def researcher(new_story):
    return new_story(fixture=StartedHelper)


@pytest.mark.parametrize("sample", [READ_FILE, WEB_READER, WEB_READER_REQUEST], ids=["a read command", "the web reader", "the web reader's own fetch"])
def test_a_researcher_may_read_with_the_shell_and_fetch_web_pages(researcher, sample):
    researcher.expect_hook_allowed(helper_agent(researcher).session, sample)


@pytest.mark.parametrize("sample", [SECOND_AGENT, SIBLING_TOOL, HookSamples.tool_use("Edit", ToolType.EDIT, ["src/cart.py"], None)], ids=["another agent", "another agent's tool", "a file change"])
def test_a_researcher_still_cannot_start_other_agents_or_change_a_file(researcher, sample):
    researcher.expect_rows(researcher.hook(helper_agent(researcher).session, sample).refusal)


def test_the_researcher_is_told_it_may_run_commands_that_only_read(researcher):
    body = Registry.read(researcher.container.get(Database)).profile(f"{RESEARCHER_PROFILE.name}").profile.body
    researcher.expect_rows("commands that only read" in body, "use Bash only for journal commands" not in body, detail=body)
