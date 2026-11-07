from typing import NamedTuple
from unittest.mock import patch

import pytest

from core.base.actor import Actor
from core.base.query.queries import Queries
from core.testing.story import Story
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from tests.stories.suites.coding.modules.workers.support.program_split import (
    dispatch, new_task, outage, split_story, split_viewer,
)


class RoutedWorkerTask(NamedTuple):
    story: Story
    worker: Actor
    task_id: int
    route_id: int


@pytest.fixture
def routed_worker_task(split_story):
    story = split_story
    worker = dispatch(story, flags="--program claude --model sonnet")
    route_id = story.new_row_id("worker-route make --program codex --tags followup --environment main", actor=story.agent)
    task_id = new_task(story, "A routed follow-up", "--tag followup --confirm")
    return RoutedWorkerTask(story, worker, task_id, route_id)


@pytest.mark.parametrize("wait_flag", ["", "--wait"])
def test_sending_a_routed_task_to_another_program_is_refused_before_git(routed_worker_task, wait_flag):
    story, worker, task_id, route_id = routed_worker_task
    with patch.object(WorktreeGit, "git", side_effect=AssertionError("the route must be checked before git")):
        story.expect_refusal(f"worker send {worker.id} --task {task_id} {wait_flag}",
                             f"task {task_id} goes to codex by route {route_id}", actor=story.agent)
    story.expect_absent(f"task show {task_id}", f"delegated_to: {worker.id}")
    story.expect_rows(not story.container.get(Queries).query(WorkerOperation).exists())


def test_a_route_skip_on_send_is_recorded_on_the_assignment_event(routed_worker_task):
    story, worker, task_id, route_id = routed_worker_task
    story.expect_refusal(f"worker send {worker.id} --wait --task {task_id}", f"route {route_id}", actor=story.agent)
    story.expect_success(f'worker send {worker.id} --wait --task {task_id} --skip-guard workers.route-holds '
                         '--skip-reason "The person requested a comparison"', actor=story.agent)
    story.expect_text(f"task show {task_id}", f"delegated_to: {worker.id}")
    story.expect_text("event list --json --limit 100", "workers.route-holds", "The person requested a comparison")


def test_a_person_can_send_a_task_to_another_program_through_the_viewer(routed_worker_task, split_viewer):
    story, worker, task_id, _ = routed_worker_task
    split_viewer.value("agents.agents", ["worker", "send", str(worker.id), "--wait", "--task", str(task_id)])
    story.expect_text(f"task show {task_id}", f"delegated_to: {worker.id}")


def test_sending_a_task_can_use_another_program_when_its_route_program_is_unavailable(routed_worker_task):
    story, worker, task_id, _ = routed_worker_task
    outage(story)
    story.expect_success(f"worker send {worker.id} --wait --task {task_id}", actor=story.agent)
    story.expect_text(f"task show {task_id}", f"delegated_to: {worker.id}")
