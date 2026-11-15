from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import BuilderStarted
import json

from engine.testing.examples.hook_samples import HookSamples
from suites.coding.modules.workers.support.available_work import AvailableWork
from tests.stories.core.support.coding_fixtures import OpenTaskBuilder, OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.phase_steps import planned_story
from tests.stories.suites.coding.support.main_controls_fixture import scope_line
from tests.stories.support.story_checks import expect_value
from suites.coding.agent_messages.task_assignment_message import TaskAssignmentMessage
from engine.testing.expectations.expected_message import expected_agent_message
from suites.coding.support.coding_settings import WRITES_CODE_SETTING

WRITES_CODE = f"{WRITES_CODE_SETTING}"
BUILD_PHASE_TASKS = (1, 2, 3)
SHIP_PHASE_TASK = 4


def assigned_task(story):
    with scope_line(story):
        return story.container.get(AvailableWork).answer(story.agent.id).assigned_task


def delegated_cards(story) -> list[dict[str, object]]:
    board = json.loads(story.run("task board --environment main --state open --json", actor=story.agent).output_text)
    return [row for row in board["groups"][0]["rows"] if row["assigned_actor_id"] is not None]


def expect_reserved(story, task: int) -> None:
    story.expect_text(f"task show {task}", "state: open", actor=story.agent)
    story.expect_text(f"task info {task}", f"assigned to: agent {story.agent.id}", actor=story.agent)














def test_a_reserved_task_is_not_offered_to_send_to_a_worker(played):
    story = played(OpenTaskOrchestrator)
    story.expect_success(f"task assign 1 --to {agent_number(story, story.agent.id)}", actor=story.agent)
    with scope_line(story):
        answer = story.container.get(AvailableWork).answer(story.agent.id)
    expect_value(answer.delegatable, ())




