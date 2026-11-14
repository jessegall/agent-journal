
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.support.worker_nudges import WORKER_TASK_BLOCKED
from tests.integration.suites.coding.modules.workers.test_gone_workers import missing_program, running_worker, worker_story
from tests.stories.support.story_checks import expect_value_4

__all__ = ["missing_program", "running_worker", "worker_story"]
MAIN_SESSION = "s-1"
BLOCK = 'task block 1 --reason "the build tool is missing"'
REQUEST_LINE = "journal worker ask"


def worker_lines(story) -> str:
    return story.run(f"agent-line list --agent {story.worker.id}").output_text


def merger_line_texts(story) -> list[str]:
    return [line.text for line in story.story_rows(MergerLine)]


def refusal_text(story, line: str) -> str:
    outcome = story.run(line, actor=story.worker)
    assert outcome.code != 0, outcome.output_text
    return outcome.output_text


def test_the_line_about_a_blocked_task_wakes_the_main_agent():
    expect_value_4(WORKER_TASK_BLOCKED.wakes_agent)
