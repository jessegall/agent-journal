import pytest

from datetime import timedelta

from core.base.driver.command_category import CommandCategory
from engine.query.queries import Queries
from core.modules.processes.models.process import Process
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder

SUITE_SAMPLE = HookSamples.shell("pytest tests", ShellPart("pytest", CommandCategory.TEST_RUN, ["tests"], is_full_test_run=True))
CART_SAMPLE = HookSamples.shell("pytest tests/cart.py", ShellPart("pytest", CommandCategory.TEST_RUN, ["tests/cart.py"]))


def run_story(new_story, sample):
    story = install_runner(new_story(fixture=StartedTaskBuilder))
    story.expect_success("task test 1", actor=story.agent)
    story.advance(timedelta(seconds=1))
    story.hook("s-1", sample)
    return story, next(story.container.get(Queries).query(Process).newest().all_rows())


def test_a_full_run_that_passes_closes_the_tasks_in_testing_and_names_them_when_it_starts(full_suite_process):
    story, process = full_suite_process
    story.expect_text(f"agent-line list --agent {story.agent.id}", "task:1 wait in testing")
    end_run(story, process, "ok\n")
    story.expect_text("task show 1", "state: completed", f"the full test run, process {process.id}, passed", actor=story.agent)


def test_a_task_that_went_to_testing_after_the_run_started_stays(new_story):
    story = install_runner(new_story(fixture=StartedTaskBuilder))
    story.hook("s-1", SUITE_SAMPLE)
    process = next(story.container.get(Queries).query(Process).newest().all_rows())
    story.advance(timedelta(seconds=1))
    story.expect_success("task test 1", actor=story.agent)
    end_run(story, process, "ok\n")
    story.expect_text("task show 1", "state: testing", actor=story.agent)


def test_a_named_test_run_closes_nothing(new_story):
    story, process = run_story(new_story, CART_SAMPLE)
    end_run(story, process, "ok\n")
    story.expect_text("task show 1", "state: testing", actor=story.agent)


def test_a_failed_full_run_leaves_the_tasks_and_names_them(full_suite_process):
    story, process = full_suite_process
    end_run(story, process, "boom\n", exit_code=1)
    story.expect_text("task show 1", "state: testing", actor=story.agent)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "the full test run failed: task:1 stay in testing")


@pytest.fixture
def full_suite_process(new_story):
    return run_story(new_story, SUITE_SAMPLE)
