from engine.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_a_main_agents_pytest_run_gives_the_runner_a_background_listing(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_success("setting set journal.core.processes.readers-forced off --environment main")
    reply = story.hook("s-1", HookSamples.shell("pytest -n 2 -q tests/cart.py", ShellPart("pytest", CommandCategory.TEST_RUN, ["-n", "2", "-q", "tests/cart.py"])))
    story.expect_rows(not reply.refusal, "JOURNAL_RUN_PROGRESS_LISTING" in str(reply.updated_input), "--collect-only" in str(reply.updated_input))
