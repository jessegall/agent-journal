from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import install_runner, emitted_read
from tests.stories.core.modules.processes.support.reader_block_fixtures import worker_run
from tests.stories.suites.coding.modules.workers.worker_test_limit import TestLimitSetup

CART_TESTS = HookSamples.shell("pytest tests/cart.py", ShellPart("pytest", CommandCategory.TEST_RUN, ["tests/cart.py"]))


def test_a_worker_whose_last_run_counted_more_tests_than_the_limit_is_refused_its_raw_test_line_for_having_no_named_test_command(new_story):
    story = install_runner(new_story(fixture=TestLimitSetup))
    process = worker_run(story, "pytest tests/cart.py", CommandCategory.TEST_RUN)
    emitted_read(story, process, "collected 8 items\n")
    story.expect_text(f"output show {process.id}", "test_count: 8", actor=story.agent)
    story.expect_hook_refusal("s-reader", CART_TESTS, "You have no test commands, so no test can run for you")
