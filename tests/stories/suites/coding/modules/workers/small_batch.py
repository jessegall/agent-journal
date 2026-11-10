from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from suites.coding.modules.workers.support.worker_settings import WORKER_BATCH_SIZE
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
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
    story = new_story(fixture=OpenTaskOrchestrator)
    lines = queue_lines(story, 1)
    expect_answers(lines, 1)
    expect_lines_with(lines, "batch of 1")


def test_the_setting_moves_the_batch_size_down(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.expect_success(f"setting make {WORKER_BATCH_SIZE} 1 --environment main", f"key: {WORKER_BATCH_SIZE}")
    expect_absent_queue_lines(story, 1)


def expect_absent_queue_lines(story, number) -> None:
    actual = queue_lines(story, number)
    assert not actual, actual
