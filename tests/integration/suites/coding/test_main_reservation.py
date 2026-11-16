import json

from suites.coding.modules.workers.support.available_work import AvailableWork
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.support.main_controls_fixture import scope_line
from tests.stories.support.story_checks import expect_value
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


def test_a_reserved_task_is_not_offered_to_send_to_a_worker(played):
    story = played(OpenTaskOrchestrator)
    story.expect_success(f"task assign 1 --to {story.agent.id}", actor=story.agent)
    with scope_line(story):
        answer = story.container.get(AvailableWork).answer(story.agent.id)
    expect_value(answer.delegatable, ())


