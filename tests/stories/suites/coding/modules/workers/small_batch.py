from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from suites.coding.modules.workers.support.worker_settings import WORKER_BATCH_SIZE
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.support.story_checks import expect_answers, expect_lines_with

MAIN_SESSION = "s-1"
DEFAULT_SIZE = 3
QUEUE_EXTRA = "queue more tasks on a worker"


def dispatched(*task_ids: int):
    arguments = ["worker", "dispatch", "--model", "sonnet", *map(str, task_ids)]
    line = f"journal {' '.join(arguments)}"
    return HookSamples.shell(line, ShellPart("journal", CommandCategory.JOURNAL, arguments, subcommand="worker")).with_fields(event="post_tool_use")


def queue_lines(story, *task_ids: int) -> list[str]:
    return [line for line in story.hook(MAIN_SESSION, dispatched(*task_ids)).lines if QUEUE_EXTRA in line]


def test_a_dispatch_of_fewer_tasks_than_the_batch_size_tells_the_main_agent_to_queue_more(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    lines = queue_lines(story, 1)
    expect_answers(lines, 1)
    expect_lines_with(lines, "batch of 1")


def test_a_dispatch_of_two_tasks_is_still_below_the_default_batch_size(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    expect_queue_lines_with(story, 1, 2, "batch of 2")


def test_a_dispatch_of_as_many_tasks_as_the_batch_size_is_told_nothing(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    expect_absent_queue_lines_2(story, 1, DEFAULT_SIZE, 1)


def test_a_dispatch_of_more_tasks_than_the_batch_size_is_told_nothing(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    expect_absent_queue_lines_2(story, 1, DEFAULT_SIZE, 3)


def test_the_setting_moves_the_batch_size_up(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.expect_success(f"setting make {WORKER_BATCH_SIZE} {DEFAULT_SIZE + 2} --environment main", f"key: {WORKER_BATCH_SIZE}")
    expect_queue_lines(story, 1, DEFAULT_SIZE, 1)
    expect_absent_queue_lines_2(story, 1, DEFAULT_SIZE, 3)


def test_the_setting_moves_the_batch_size_down(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.expect_success(f"setting make {WORKER_BATCH_SIZE} 1 --environment main", f"key: {WORKER_BATCH_SIZE}")
    expect_absent_queue_lines(story, 1)


def test_a_line_that_dispatches_nothing_is_told_nothing(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    sample = HookSamples.shell("journal worker send 5 job", ShellPart("journal", CommandCategory.JOURNAL, ["worker", "send", "5", "job"], subcommand="worker")).with_fields(event="post_tool_use")
    expect_absent_lines_hook(story, MAIN_SESSION, sample, QUEUE_EXTRA)


def expect_absent_lines_hook(story, item, sample, item_2) -> None:
    actual = [line for line in story.hook(item, sample).lines if item_2 in line]
    assert not actual, actual


def expect_absent_queue_lines(story, number) -> None:
    actual = queue_lines(story, number)
    assert not actual, actual


def expect_absent_queue_lines_2(story, number, item, number_2) -> None:
    actual = queue_lines(story, *range(number, item + number_2))
    assert not actual, actual


def expect_queue_lines(story, number, item, number_2) -> None:
    actual = queue_lines(story, *range(number, item + number_2))
    assert actual, actual


def expect_queue_lines_with(story, number, number_2, expected) -> None:
    actual = queue_lines(story, number, number_2)[0]
    assert expected in actual, actual
