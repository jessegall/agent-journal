from engine.enums.command_category import CommandCategory
from engine.enums.tool_type import ToolType
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders
from tests.stories.core.support.coding_fixtures import UserBuilder

REDIRECTED_TESTS = HookSamples.shell("pytest -q > results.txt", ShellPart("pytest", CommandCategory.TEST_RUN, ["-q"]), redirects=["> results.txt"])
REDIRECT_EXIT = "pytest goes to a file, so no reader sees it: run it without the redirect, and read it by its output number"


def raw_test_line() -> object:
    """A main agent's test line typed by hand while a saved command for tests exists."""
    part = ShellPart("pytest", CommandCategory.TEST_RUN, ["tests/one.py"]).prepared("pytest tests/one.py")
    shell = {"line": "pytest tests/one.py", "parts": [part], "aliases": ["run-tests"], "redirects": [], "is_journal_only": False, "parse_error": "", "saved_commands_known": True}
    return HookSamples.tool_use("Bash", ToolType.SHELL, [], None, shell=shell)


def test_a_saved_command_refusal_names_its_skip_with_a_reason(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success('alias add run-tests "pytest"', actor=story.agent)
    story.expect_hook_refusal("s-1", raw_test_line(), "journal refusal skip aliases.saved-command --reason")


def test_a_redirected_test_run_is_prevented_at_each_start_with_the_exit_to_drop_the_redirect(new_story):
    story = new_story(fixture=ForcedReaders)
    story.expect_hook_refusal("s-reader", REDIRECTED_TESTS, REDIRECT_EXIT)
    story.expect_hook_refusal("s-reader", REDIRECTED_TESTS, "journal refusal skip processes.reading --reason")
