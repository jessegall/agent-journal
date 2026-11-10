from datetime import timedelta

import pytest

from engine.command.bus import Bus
from suites.coding.modules.workers.commands.end_inactive_worker.end_inactive_worker import EndInactiveWorker
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.gone_workers import missing_program, running_worker, worker_story
from tests.stories.suites.coding.modules.workers.stopped_with_tasks import MAIN_SESSION, ended, expect_worker_restart, main_agent_lines, retried, two_task_worker
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

__all__ = ["missing_program", "running_worker", "two_task_worker", "worker_story"]

ROUND = timedelta(minutes=10)
RESUME_LIMIT = "suites.coding.modules.workers.support.worker_job.RESUME_LIMIT_COUNT"


def ended_worker_line(story, worker_id: int) -> str:
    return f"worker:{agent_number(story, worker_id)} ended and still holds"


def next_round(story) -> None:
    story.advance(ROUND)
    story.tick(MAIN_SESSION)


@pytest.fixture
def ended_with_open_tasks(two_task_worker, monkeypatch):
    """A worker with two open tasks whose program ended and that nothing starts again."""
    monkeypatch.setattr(RESUME_LIMIT, 0)
    ended(two_task_worker)
    two_task_worker.tick(MAIN_SESSION)
    return two_task_worker


@pytest.fixture
def ended_with_unmerged_work(new_story):
    """A worker whose only task is finished and checked, whose program ended before its work was merged."""
    story = new_story(fixture=OpenTaskOrchestrator)
    story.repository = repository_environment(story)
    story.worker = checked_worker(story, story.repository)
    story.container.get(Bus).run(EndInactiveWorker(story.worker.id), story.agent)
    story.tick(MAIN_SESSION)
    return story


def test_a_worker_that_ended_while_it_holds_open_tasks_is_named_to_the_main_agent_at_once_and_in_the_overview(ended_with_open_tasks):
    story = ended_with_open_tasks
    line = ended_worker_line(story, story.worker.id)
    lines = main_agent_lines(story)
    story.expect_rows(lines.count(line) == 1, detail=lines)
    story.expect_text("overview", line, actor=story.agent)


def test_the_line_comes_again_each_round_while_the_worker_holds_tasks_and_does_not_run(ended_with_open_tasks):
    story = ended_with_open_tasks
    next_round(story)
    next_round(story)
    lines = main_agent_lines(story)
    story.expect_rows(lines.count(ended_worker_line(story, story.worker.id)) == 3, detail=lines)


def test_no_line_comes_once_the_worker_runs_again(two_task_worker):
    story = two_task_worker
    ended(story)
    story.tick(MAIN_SESSION)
    expect_worker_restart(story, retried(story))
    story.run_listeners()
    next_round(story)
    lines = main_agent_lines(story)
    story.expect_rows(lines.count(ended_worker_line(story, story.worker.id)) == 1, detail=lines)


def test_no_line_comes_once_the_worker_is_released(ended_with_open_tasks):
    story = ended_with_open_tasks
    story.expect_success(f'worker release {agent_number(story, story.worker.id)} "Its tasks go to another worker"', actor=story.agent)
    next_round(story)
    lines = main_agent_lines(story)
    story.expect_rows(lines.count(ended_worker_line(story, story.worker.id)) == 1, detail=lines)
    story.expect_absent("overview", ended_worker_line(story, story.worker.id), actor=story.agent)


def test_a_worker_that_ended_with_finished_unmerged_work_is_named_too(ended_with_unmerged_work):
    story = ended_with_unmerged_work
    lines = main_agent_lines(story)
    story.expect_rows(lines.count(ended_worker_line(story, story.worker.id)) == 1, detail=lines)


def test_once_its_work_is_merged_a_worker_that_ended_holds_nothing_and_no_line_comes(ended_with_unmerged_work):
    story = ended_with_unmerged_work
    story.repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge --wait {agent_number(story, story.worker.id)}", actor=story.agent)
    story.run_listeners()
    next_round(story)
    next_round(story)
    lines = main_agent_lines(story)
    story.expect_rows(lines.count(ended_worker_line(story, story.worker.id)) == 1, detail=lines)
    story.expect_absent("overview", ended_worker_line(story, story.worker.id), actor=story.agent)
