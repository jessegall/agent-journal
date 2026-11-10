import pytest

from engine.driver.command_category import CommandCategory
from engine.driver.command_effect import CommandEffect
from engine.driver.tool_type import ToolType
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.drivers.support.access_rules import ACCESS_MODULE, AccessStarted
from tests.stories.support.story_checks import expect_refusal_hook_rule

READ = HookSamples.tool_use("Read", ToolType.READ, ["cart.py"], None)
SEARCH = HookSamples.tool_use("Search", ToolType.SEARCH, ["cart.py"], None)
EDIT = HookSamples.edit("cart.py")
NEW_FILE = HookSamples.tool_use("Write", ToolType.NEW_FILE, ["cart.py"], None)
LS = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, []))
FILE_REMOVAL = HookSamples.shell("rm cart.py", ShellPart("rm", CommandCategory.EDIT, ["cart.py"], effects=[CommandEffect.WRITES_FILES]))
REDIRECT = HookSamples.shell("ls > files", ShellPart("ls", CommandCategory.READ, []), redirects=[">files"])
JOURNAL = HookSamples.shell("journal task make Cart", ShellPart("journal", CommandCategory.JOURNAL, ["task", "make", "Cart"], effects=[CommandEffect.WRITES_FILES]))
MIXED = HookSamples.shell("journal task list && rm cart.py", ShellPart("journal", CommandCategory.JOURNAL, ["task", "list"]), ShellPart("rm", CommandCategory.EDIT, ["cart.py"], effects=[CommandEffect.WRITES_FILES]))
UNKNOWN = HookSamples.shell("custom", ShellPart("custom", CommandCategory.UNKNOWN, []))
GIT_CHAIN = HookSamples.shell("ls && git status", ShellPart("ls", CommandCategory.READ, []), ShellPart("git", CommandCategory.VERSION_CONTROL, ["status"]))
CURL = HookSamples.shell("curl example.com", ShellPart("curl", CommandCategory.NETWORK, ["example.com"]))
FULL_TESTS = HookSamples.shell("ls && pytest tests", ShellPart("ls", CommandCategory.READ, []), ShellPart("pytest", CommandCategory.TEST_RUN, ["tests"], is_full_test_run=True))
FILE_TESTS = HookSamples.shell("pytest tests/cart.py", ShellPart("pytest", CommandCategory.TEST_RUN, ["tests/cart.py"]))
MALFORMED = LS.with_fields(tool={**LS.body["tool"], "shell": {**LS.body["tool"]["shell"], "parse_error": "unbalanced quote"}})
READ_JOURNAL = HookSamples.shell("ls && journal task make Cart", ShellPart("ls", CommandCategory.READ, []), ShellPart("journal", CommandCategory.JOURNAL, ["task", "make", "Cart"], effects=[CommandEffect.WRITES_FILES]))
DESCRIPTOR_REDIRECT = HookSamples.shell("ls 2>&1", ShellPart("ls", CommandCategory.READ, []), redirects=["2>&1"])
JOURNAL_REDIRECT = HookSamples.shell("journal task list > tasks", ShellPart("journal", CommandCategory.JOURNAL, ["task", "list"]), redirects=[">tasks"])
MISSING_SHELL = HookSamples.tool_use("Bash", ToolType.SHELL, [], None)


@pytest.fixture
def rule_story(new_story, request):
    story = new_story(ACCESS_MODULE, fixture=AccessStarted)
    story.expect_success(f"driver choose access.{request.param} --environment main")
    return story


@pytest.mark.parametrize("rule_story,sample", [
    ("reader", READ), ("reader", SEARCH), ("reader", LS), ("reader", JOURNAL),
    ("reader", READ_JOURNAL), ("reader", DESCRIPTOR_REDIRECT),
    ("writer", READ), ("writer", EDIT), ("writer", NEW_FILE), ("writer", FILE_REMOVAL), ("writer", REDIRECT),
    ("journal", JOURNAL), ("no-shell", EDIT),
    ("no-git", LS), ("named-tests", FILE_TESTS), ("read-tool", READ),
    ("read-commands", LS), ("read-commands", JOURNAL), ("no-curl", LS),
    ("unrestricted", FILE_REMOVAL), ("unrestricted", GIT_CHAIN), ("unrestricted", FULL_TESTS),
], indirect=["rule_story"])
def test_a_suite_lists_a_core_rule_and_its_allowed_tools_still_run(rule_story, sample):
    rule_story.expect_hook_allowed("s-1", sample)


@pytest.mark.parametrize("rule_story,sample", [
    ("reader", EDIT), ("reader", NEW_FILE), ("reader", FILE_REMOVAL), ("reader", REDIRECT),
    ("reader", MIXED), ("reader", UNKNOWN), ("reader", MALFORMED),
    ("reader", MISSING_SHELL), ("reader", JOURNAL_REDIRECT),
    ("writer", UNKNOWN), ("writer", FILE_TESTS), 
    ("journal", LS), ("journal", EDIT), ("journal", MIXED), ("journal", REDIRECT),
    ("no-shell", LS), ("no-git", GIT_CHAIN),
    ("named-tests", FULL_TESTS), ("read-tool", SEARCH), ("read-tool", LS),
    ("read-commands", FILE_REMOVAL), ("read-commands", MIXED), ("no-curl", CURL),
], indirect=["rule_story"])
def test_a_suite_lists_a_core_rule_and_its_refused_tools_do_not_run(rule_story, sample):
    expect_refusal_hook_rule(rule_story, "s-1", sample)


@pytest.mark.parametrize("rule_story", ["reader", "journal", "no-shell", "no-git", "named-tests"], indirect=True)
def test_tool_restrictions_do_not_refuse_the_stop_hook(rule_story):
    rule_story.expect_hook_allowed("s-1", HookSamples.stop())
