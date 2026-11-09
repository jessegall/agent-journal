import json

from core.testing.hook_samples import HookSamples
from suites.coding.modules.workers.support.available_work import AvailableWork
from tests.stories.core.support.coding_fixtures import BuilderWithOpenTask, OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.phase_steps import planned_story
from tests.stories.suites.coding.support.main_controls_fixture import scope_line
from tests.stories.support.story_checks import expect_value

WRITES_CODE = "journal.suites.coding.main-writes-code"
BUILD_PHASE_TASKS = (1, 2, 3)
SHIP_PHASE_TASK = 4


def assigned_task(story):
    with scope_line(story):
        return story.container.get(AvailableWork).answer(story.agent.id).own_task


def plan_tasks(story) -> dict[int, dict[str, object]]:
    phases = json.loads(story.run("plan inspect 1 --json", actor=story.user).output_text)["phases"]
    return {task["id"]: task for phase in phases for task in phase["tasks"]}


def delegated_cards(story) -> list[dict[str, object]]:
    board = json.loads(story.run("task board --environment main --state open --json", actor=story.agent).output_text)
    return [row for row in board["groups"][0]["rows"] if row["delegated_to"] is not None]


def expect_reserved(story, task: int) -> None:
    story.expect_text(f"task show {task}", f"delegated_to: {story.agent.id}", "state: open", actor=story.agent)


def test_a_main_agent_claims_an_open_task_ahead_of_time(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    story.expect_success(f"task assign 1 --to {story.agent.id}", actor=story.agent)
    expect_reserved(story, 1)


def test_a_person_assigns_a_task_to_the_main_agent_and_the_board_shows_who_it_waits_for(new_story):
    story = planned_story(new_story)
    story.expect_success(f"task assign 1 --to {story.agent.id}", actor=story.user)
    card = delegated_cards(story)[0]
    expect_value((card["id"], card["delegated_to"], card["delegated_name"]), (1, story.agent.id, f"Agent {story.agent.id}"))


def test_a_main_agent_claims_a_whole_plan_and_the_plan_shows_it(new_story):
    story = planned_story(new_story)
    story.expect_success(f"plan assign 1 --to {story.agent.id}", actor=story.agent)
    for task in (*BUILD_PHASE_TASKS, SHIP_PHASE_TASK):
        expect_reserved(story, task)
    inspection = json.loads(story.run("plan inspect 1 --json", actor=story.user).output_text)
    expect_value((inspection["assignee"]["is_main"], inspection["delegated"]), (True, True))
    expect_value(plan_tasks(story)[1]["helper_id"], story.agent.id)


def test_a_person_assigns_one_phase_to_the_main_agent_and_the_plan_keeps_no_agent(new_story):
    story = planned_story(new_story)
    story.expect_success(f"plan assign 1 --phase 2 --to {story.agent.id}", actor=story.user)
    expect_reserved(story, SHIP_PHASE_TASK)
    for task in BUILD_PHASE_TASKS:
        story.expect_absent(f"task show {task}", "delegated_to", actor=story.agent)
    expect_value(json.loads(story.run("plan inspect 1 --json", actor=story.user).output_text)["assignee"], None)
    expect_value(plan_tasks(story)[SHIP_PHASE_TASK]["helper_id"], story.agent.id)


def test_a_phase_that_is_not_in_the_plan_is_refused(new_story):
    story = planned_story(new_story)
    story.expect_refusal(f"plan assign 1 --phase 9 --to {story.agent.id}", "phase 9 is not in plan 1", actor=story.agent)


def test_a_reserved_task_reaches_a_stopping_main_agent_with_auto_mode_off(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.expect_success("driver choose coding.main --environment main")
    story.expect_success(f"task assign 1 --to {story.agent.id}", actor=story.agent)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "is yours now")
    story.expect_text("task show 1", "state: started", f"holder_id: {story.agent.id}", actor=story.agent)


def test_an_open_task_stays_with_auto_mode_while_a_reservation_ends_when_the_main_agent_starts_it(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    expect_value(assigned_task(story), None)
    story.expect_success(f"task assign 1 --to {story.agent.id}", actor=story.agent)
    expect_value(assigned_task(story).id, 1)
    story.expect_success("task start 1", actor=story.agent)
    story.expect_absent("task show 1", "delegated_to", actor=story.agent)
    story.expect_text("task show 1", f"holder_id: {story.agent.id}", actor=story.agent)


def test_a_reserved_task_of_a_plan_waits_for_the_plan_to_start_and_comes_in_its_order(new_story):
    story = planned_story(new_story)
    story.expect_success(f"plan assign 1 --to {story.agent.id}", actor=story.user)
    expect_value(assigned_task(story), None)
    story.expect_success("plan start 1", actor=story.user)
    expect_value(assigned_task(story).id, 1)


def test_a_main_agent_that_writes_no_code_cannot_have_a_task_reserved(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    story.expect_success(f"setting set {WRITES_CODE} off --environment main")
    story.expect_refusal(f"task assign 1 --to {story.agent.id}", "task 1 goes to a worker", actor=story.agent)
    story.expect_absent("task show 1", "delegated_to", actor=story.agent)


def test_letting_the_agent_pick_reserves_nothing(new_story):
    story = planned_story(new_story)
    story.expect_success("plan assign 1", actor=story.user)
    for task in BUILD_PHASE_TASKS:
        story.expect_absent(f"task show {task}", "delegated_to", actor=story.agent)


def test_a_reserved_task_is_not_sent_to_a_worker(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    story.expect_success(f"task assign 1 --to {story.agent.id}", actor=story.agent)
    story.expect_refusal("worker dispatch --model sonnet 1", f"task 1 is reserved for agent {story.agent.id}", actor=story.agent)
    expect_reserved(story, 1)


def test_a_plan_sent_to_a_worker_leaves_the_task_reserved_for_the_main_agent(new_story):
    story = planned_story(new_story)
    story.expect_success(f"task assign 1 --to {story.agent.id}", actor=story.agent)
    worker = dispatched_worker(story, "worker dispatch --model sonnet --plan 1 --phase 1")
    expect_reserved(story, 1)
    story.expect_text("task show 2", f"delegated_to: {worker.id}", actor=story.agent)
    story.expect_refusal("task start 1", f"task 1 is reserved for agent {story.agent.id}", actor=worker)


def test_a_reserved_task_is_not_offered_to_send_to_a_worker(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.expect_success(f"task assign 1 --to {story.agent.id}", actor=story.agent)
    with scope_line(story):
        answer = story.container.get(AvailableWork).answer(story.agent.id)
    expect_value(answer.delegatable, ())


def test_a_person_moves_a_task_reserved_for_the_main_agent_to_a_worker(new_story):
    story = planned_story(new_story)
    worker = dispatched_worker(story, "worker dispatch --model sonnet 2")
    story.expect_success(f"task assign 1 --to {story.agent.id}", actor=story.user)
    story.expect_success(f"task assign 1 --to {worker.id}", actor=story.user)
    story.expect_text("task show 1", f"delegated_to: {worker.id}", actor=story.agent)
