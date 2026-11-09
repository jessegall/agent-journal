from tests.stories.core.support.coding_fixtures import BuilderStarted
import json

from core.testing.hook_samples import HookSamples
from suites.coding.modules.workers.support.available_work import AvailableWork
from tests.stories.core.support.coding_fixtures import OpenTaskBuilder, OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.phase_steps import planned_story
from tests.stories.suites.coding.support.main_controls_fixture import scope_line
from tests.stories.support.story_checks import expect_value

WRITES_CODE = "journal.suites.coding.main-writes-code"
BUILD_PHASE_TASKS = (1, 2, 3)
SHIP_PHASE_TASK = 4


def assigned_task(story):
    with scope_line(story):
        return story.container.get(AvailableWork).answer(story.agent.id).assigned_task


def delegated_cards(story) -> list[dict[str, object]]:
    board = json.loads(story.run("task board --environment main --state open --json", actor=story.agent).output_text)
    return [row for row in board["groups"][0]["rows"] if row["delegated_to"] is not None]


def expect_reserved(story, task: int) -> None:
    story.expect_text(f"task show {task}", f"delegated_to: {story.agent.id}", "state: open", actor=story.agent)


def test_a_main_agent_claims_an_open_task_ahead_of_time(new_story):
    story = new_story(fixture=OpenTaskBuilder)
    story.expect_success(f"task assign 1 --to {story.agent.id}", actor=story.agent)
    expect_reserved(story, 1)


def test_a_person_assigns_a_task_to_the_main_agent_and_the_board_shows_who_it_waits_for(new_story):
    story = planned_story(new_story)
    story.expect_success(f"task assign 1 --to {story.agent.id}", actor=story.user)
    card = delegated_cards(story)[0]
    expect_value((card["id"], card["delegated_to"], card["delegated_name"]), (1, story.agent.id, f"Agent {story.agent.id}"))


def test_a_reserved_task_reaches_a_stopping_main_agent_with_auto_mode_off(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.expect_success("driver choose coding.main --environment main")
    story.expect_success(f"task assign 1 --to {story.agent.id}", actor=story.agent)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "is yours now")
    story.expect_text("task show 1", "state: started", f"holder_id: {story.agent.id}", actor=story.agent)


def test_an_open_task_stays_with_auto_mode_while_a_reservation_ends_when_the_main_agent_starts_it(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    expect_value(assigned_task(story), None)
    story.expect_success(f"task assign 1 --to {story.agent.id}", actor=story.agent)
    expect_value(assigned_task(story).id, 1)
    story.expect_success("task start 1", actor=story.agent)
    story.expect_absent("task show 1", "delegated_to", actor=story.agent)
    story.expect_text("task show 1", f"holder_id: {story.agent.id}", actor=story.agent)


def test_a_main_agent_that_writes_no_code_cannot_have_a_task_reserved(new_story):
    story = new_story(fixture=OpenTaskBuilder)
    story.expect_success(f"setting set {WRITES_CODE} off --environment main")
    story.expect_refusal(f"task assign 1 --to {story.agent.id}", "task 1 goes to a worker", actor=story.agent)
    story.expect_absent("task show 1", "delegated_to", actor=story.agent)


def test_a_reserved_task_is_not_sent_to_a_worker(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.expect_success(f"task assign 1 --to {story.agent.id}", actor=story.agent)
    story.expect_refusal("worker dispatch --test-command python=pytest --model sonnet 1", f"task 1 is reserved for agent {story.agent.id}", actor=story.agent)
    expect_reserved(story, 1)


def test_a_reserved_task_is_not_offered_to_send_to_a_worker(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.expect_success(f"task assign 1 --to {story.agent.id}", actor=story.agent)
    with scope_line(story):
        answer = story.container.get(AvailableWork).answer(story.agent.id)
    expect_value(answer.delegatable, ())


def test_a_blocked_task_can_be_assigned_to_a_main_agent_and_stays_blocked(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success('task make "Waits for a person" --environment main', actor=story.user)
    story.expect_success('task block 1 --reason "needs an answer"', actor=story.user)
    story.expect_success(f"task assign 1 --to {story.agent.id}", actor=story.user)
    story.expect_text("task info 1", "state: blocked", f"delegated to: agent {story.agent.id}", actor=story.agent)


def test_a_task_an_agent_starts_is_assigned_to_it(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('task make "Taken by the agent" --environment main', actor=story.user)
    story.expect_success("task start 1", actor=story.agent)
    story.expect_text("task info 1", f"delegated to: agent {story.agent.id}", actor=story.agent)
