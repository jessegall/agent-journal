from datetime import timedelta

from core.modules.tasks.unlogged_write_limit import UNLOGGED_WRITES_CEILING
from core.modules.tasks.log_request import LOG_REQUEST_WRITES
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import BuilderWithStartedTask

CART_EDIT = HookSamples.edit("src/cart.py")
CART_SEARCH = HookSamples.shell("grep -n total src/cart.py", ShellPart("grep", "search", ["-n", "total", "src/cart.py"]))


def edits(story, count: int) -> None:
    for _ in range(count):
        story.hook("s-1", CART_EDIT)


def test_a_builder_is_asked_to_log_its_task_at_the_write_that_reaches_the_count_since_its_last_log(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    edits(story, LOG_REQUEST_WRITES - 1)
    story.expect_hook_allowed("s-1", CART_EDIT, f"{LOG_REQUEST_WRITES} writes since you logged task 1, Fix the cart")


def test_a_builder_that_logs_its_task_counts_its_writes_from_the_log(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    edits(story, LOG_REQUEST_WRITES - 1)
    story.advance(timedelta(minutes=1))
    story.run("task log 1 'the totals are worked out'", actor=story.agent)
    story.expect_absent_hook_line("s-1", CART_EDIT, "writes since you logged task 1")


def test_a_builder_writes_nothing_more_past_the_hold_count_until_it_logs(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    edits(story, UNLOGGED_WRITES_CEILING - 1)
    story.expect_hook_refusal("s-1", CART_EDIT, f"{UNLOGGED_WRITES_CEILING} writes since you logged task 1")
    story.expect_hook_allowed("s-1", CART_SEARCH)
    story.advance(timedelta(minutes=1))
    story.run("task log 1 'the totals and the tax are done'", actor=story.agent)
    story.expect_hook_allowed("s-1", CART_EDIT)
