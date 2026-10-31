from core.base.driver.command_category import CommandCategory
from core.base.driver.command_effect import CommandEffect
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import SubagentStarted

SUBAGENT = {"subagent": "sub-1"}
CART_SEARCH = HookSamples.shell("grep -n total src/cart.py", ShellPart("grep", CommandCategory.SEARCH, ["-n", "total", "src/cart.py"])).with_fields(**SUBAGENT)
CART_EDIT = HookSamples.edit("src/cart.py").with_fields(**SUBAGENT)
CART_REMOVAL = HookSamples.shell("rm src/cart.py", ShellPart("rm", CommandCategory.EDIT, ["src/cart.py"], effects=[CommandEffect.WRITES_FILES])).with_fields(**SUBAGENT)


def test_a_subagent_reads_and_searches(new_story):
    story = new_story(fixture=SubagentStarted)
    story.expect_hook_allowed("s-1", CART_SEARCH)


def test_a_subagent_edits_no_file(new_story):
    story = new_story(fixture=SubagentStarted)
    story.expect_hook_refusal("s-1", CART_EDIT, "a subagent reads and searches only")


def test_a_subagent_runs_no_command_that_writes_files(new_story):
    story = new_story(fixture=SubagentStarted)
    story.expect_hook_refusal("s-1", CART_REMOVAL, "a subagent reads and searches only")


def test_a_subagent_waiting_under_an_exclusive_layer_still_edits_no_file(new_story):
    story = new_story(fixture=SubagentStarted)
    story.run('task make "The review" --environment main')
    story.run("wait on 'the review of the cart' --target tasks:1", actor=story.subagent)
    story.expect_hook_refusal("s-1", CART_EDIT, "a subagent reads and searches only")
