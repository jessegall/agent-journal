from tests.stories.core.support.agent_labels import agent_number
import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.journal.journal_home import LAUNCHER_SOCKET
from core.modules.agents.testing.fake_launcher import FakeLauncher
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment
from tests.stories.core.support.agent_labels import agent_label

TASK_COUNT = 15


def read_state(story, task_id: int) -> str:
    return next(line.removeprefix("state: ") for line in story.run(f"task show {task_id}", actor=story.agent).output_text.splitlines() if line.startswith("state: "))


@pytest.fixture
def worker_with_waiting_tasks(new_story):
    """A worker that holds fifteen tasks: it runs task 1, the others wait on it and task 15 also on task 14."""
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.worker = dispatched_worker(story)
    for number in range(2, TASK_COUNT + 1):
        story.expect_success(f'task make "Step {number}"', actor=story.agent)
        story.expect_text(f"task assign {number} --to {agent_number(story, story.worker.id)}", "created: assignment:", actor=story.agent)
        story.expect_success(f"task depend {number} --on 1", actor=story.agent)
    story.expect_success(f"task depend {TASK_COUNT} --on {TASK_COUNT - 1}", actor=story.agent)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    FakeLauncher.listening(story.home.socket(LAUNCHER_SOCKET), answer=b"stopped\n", request_count=2)
    return story


def test_a_stop_of_a_worker_with_fifteen_waiting_tasks_passes_the_repeated_read_check(worker_with_waiting_tasks):
    story = worker_with_waiting_tasks
    story.expect_success(f"agent stop {agent_number(story, story.worker.id)}", f"stopped {agent_label(story, story.worker.id)}", actor=story.user)
    story.run_listeners()


def test_a_stop_blocks_each_task_that_waited_on_what_the_worker_held(worker_with_waiting_tasks):
    story = worker_with_waiting_tasks
    initial_states = [read_state(story, number) for number in range(2, TASK_COUNT)]
    story.expect_success(f"agent stop {agent_number(story, story.worker.id)}", actor=story.user)
    story.expect_rows(initial_states == ["open"] * len(initial_states), all(read_state(story, number) == "blocked" for number in range(2, TASK_COUNT + 1)))
    story.expect_text("task show 3", "reason: waits on task 1", actor=story.agent)
