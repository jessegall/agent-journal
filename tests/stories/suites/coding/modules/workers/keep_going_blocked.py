from datetime import timedelta

import pytest

from engine.query.queries import Queries
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.support.worker_nudges import WORKER_TASK_BLOCKED
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.gone_workers import RESUMED_PID, missing_program, running_worker, start_launcher, worker_story
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry

__all__ = ["missing_program", "running_worker", "worker_story"]

MAIN_SESSION = "s-1"
BLOCK = 'task block 1 --reason "the build tool is missing"'
ASK_LINE = "journal worker ask"


def worker_lines(story) -> str:
    return story.run(f"agent-line list --agent {story.worker.id}").output_text


def merger_line_texts(story) -> list[str]:
    return [line.text for line in story.container.get(Queries).query(MergerLine).all_rows()]


def refusal_text(story, line: str) -> str:
    outcome = story.run(line, actor=story.worker)
    assert outcome.code != 0, outcome.output_text
    return outcome.output_text


@pytest.fixture
def worker_on_a_task(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.repository = repository_environment(story)
    story.worker = dispatched_worker(story)
    return story


@pytest.fixture
def worker_blocked_its_task(worker_on_a_task):
    worker_on_a_task.expect_success(BLOCK, actor=worker_on_a_task.worker)
    return worker_on_a_task


def test_a_blocked_task_is_not_left_to_the_merger(worker_blocked_its_task):
    story = worker_blocked_its_task
    texts = merger_line_texts(story)
    story.expect_rows(not any("blocked task:1" in text for text in texts), detail=str(texts))


def test_the_line_about_a_blocked_task_wakes_the_main_agent():
    assert WORKER_TASK_BLOCKED.wakes_agent


def test_worker_deliver_on_a_blocked_task_is_refused_and_hands_in_nothing(worker_blocked_its_task):
    story = worker_blocked_its_task
    text = refusal_text(story, "worker deliver --wait --differences none")
    story.expect_rows("task 1 is blocked" in text, detail=text)
    story.expect_text("worker-worktree list --json", '"state": "cut"', actor=story.agent)


def test_a_worker_whose_task_the_main_agent_blocks_is_told(worker_on_a_task):
    story = worker_on_a_task
    story.expect_success(BLOCK, actor=story.agent)
    lines = worker_lines(story)
    story.expect_rows("task:1 was blocked" in lines, detail=lines)


def test_a_stopped_worker_whose_blocked_task_opens_is_started_again(running_worker):
    story = running_worker
    story.expect_success(BLOCK, actor=story.agent)
    story.use_processes()
    story.tick(MAIN_SESSION)
    story.advance(timedelta(minutes=1))
    launcher = start_launcher(story, f"started {RESUMED_PID}\n".encode())
    story.expect_success("task unblock 1", actor=story.agent)
    story.run_listeners()
    WorkerResumeRetry()(story.container)
    launcher.drain_requests()
    story.expect_rows(len(launcher.starts) == 1, launcher.starts[0]["agent_id"] == story.worker.id, detail=str(launcher.requests))
