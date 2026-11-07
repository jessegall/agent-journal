from core.base.driver.command_category import CommandCategory
from core.base.driver.command_effect import CommandEffect
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import BuilderStarted

MEMORY_FILE = "/Users/ada/.claude/projects/-Users-ada-shop/memory/cart.md"
BAN = "Claude's own memory files are not written here: keep it with journal memory make"


def test_editing_a_native_memory_file_is_refused(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_hook_refusal("s-1", HookSamples.edit(MEMORY_FILE), BAN)


def test_a_shell_line_that_writes_into_the_native_memory_folder_is_refused(new_story):
    story = new_story(fixture=BuilderStarted)
    line = HookSamples.shell(f"rm {MEMORY_FILE}", ShellPart("rm", CommandCategory.EDIT, [MEMORY_FILE], effects=[CommandEffect.WRITES_FILES]))
    story.expect_hook_refusal("s-1", line, BAN)


def test_a_shell_line_that_only_reads_the_native_memory_folder_is_allowed(new_story):
    story = new_story(fixture=BuilderStarted)
    line = HookSamples.shell(f"grep -n cart {MEMORY_FILE}", ShellPart("grep", CommandCategory.SEARCH, ["-n", "cart", MEMORY_FILE]))
    story.expect_absent_hook_line("s-1", line, "Claude's own memory files")


def test_editing_any_other_file_says_nothing_about_memory(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_absent_hook_line("s-1", HookSamples.edit("memory/cart.py"), "Claude's own memory files")
