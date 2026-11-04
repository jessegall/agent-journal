import json

from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.core.modules.chat.support.mark_samples import expect_absent_marks_text, expect_marks_text
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from tests.stories.suites.coding.modules.workers.test_queue import recording_launch
from tests.stories.core.support.fixtures import UserJoined


def planned_story(new_story, approve: bool = True):
    """Plan 1 with phase Build holding the open tasks 1 (Fix the cart), 2 and 3, and phase Ship holding task 4."""
    story = new_story(fixture=OrchestratorWithOpenTask)
    UserJoined().steps(story)
    repository_environment(story)
    story.run('plan make "Rebuild the cart" --environment main')
    story.run('phase make --plan 1 "Build"')
    story.run('phase make --plan 1 "Ship"')
    story.run("phase place 1 --phase 1")
    for title, phase in (("Tax", 1), ("Totals", 1), ("Release", 2)):
        task_id = story.new_row_id(f'task make "{title}" --environment main')
        story.run(f"phase place {task_id} --phase {phase}")
    if approve:
        for move in ("ready", "approve"):
            story.run(f"plan {move} 1 --environment main", actor=story.user)
    return story


def outline_of(story) -> dict:
    return json.loads(story.run("plan outline 1 --json", actor=story.agent).output_text)


def expect_queued_for(outline, task_id, agent_id) -> None:
    task = [task for phase in outline["phases"] for task in phase["tasks"] if task["id"] == task_id][0]
    actual = (task["state"], task["helper_id"], bool(task["helper_name"]))
    assert actual == ("open", agent_id, True), actual


def expect_agents(outline, expected) -> None:
    actual = (outline["delegated"], [(agent["task_id"], bool(agent["name"])) for agent in outline["agents"]])
    assert actual == expected, actual


def test_a_dispatch_for_a_phase_hands_the_worker_that_phases_open_tasks_in_plan_order(new_story, monkeypatch):
    story = planned_story(new_story)
    recording_launch(monkeypatch)
    worker = Actor(story.new_row_id("worker dispatch --model sonnet --plan 1 --phase 1", actor=story.agent), ActorType.AGENT)
    expect_agents(outline_of(story), (True, [(1, True), (2, True), (3, True)]))
    board = json.loads(story.run("plan board --environment main --json", actor=story.agent).output_text)["plans"][0]
    expect_agents(board, (True, [(1, True), (2, True), (3, True)]))
    expect_queued_for(outline_of(story), 2, worker.id)
    story.expect_text("task show 4", "state: open", actor=story.agent)
    story.expect_text(f"task show 2", f"delegated_to: {worker.id}", actor=story.agent)


def test_a_dispatch_for_a_whole_plan_hands_the_worker_every_open_task_phase_by_phase(new_story, monkeypatch):
    story = planned_story(new_story)
    recording_launch(monkeypatch)
    story.run("worker dispatch --model sonnet --plan 1", actor=story.agent)
    expect_agents(outline_of(story), (True, [(1, True), (2, True), (3, True), (4, True)]))


def test_a_dispatch_for_a_plan_that_is_only_a_draft_is_refused(new_story):
    story = planned_story(new_story, approve=False)
    story.expect_refusal("worker dispatch --model sonnet --plan 1", "plan 1 is draft", actor=story.agent)


def test_a_dispatch_for_a_phase_of_another_plan_is_refused(new_story):
    story = planned_story(new_story)
    story.expect_refusal("worker dispatch --model sonnet --plan 1 --phase 9", "phase 9 is not in plan 1", actor=story.agent)


def test_a_dispatch_names_tasks_or_a_plan_and_not_both_nor_a_phase_alone(new_story):
    story = planned_story(new_story)
    story.expect_refusal("worker dispatch --model sonnet --plan 1 2", "takes tasks or a plan, not both", actor=story.agent)
    story.expect_refusal("worker dispatch --model sonnet --phase 1", "--phase needs --plan", actor=story.agent)
    story.expect_refusal("worker dispatch --model sonnet", "tasks or to a plan", actor=story.agent)


def test_a_dispatch_for_a_phase_shows_a_mark_that_the_plan_was_handed_over(new_story, monkeypatch):
    story = planned_story(new_story)
    recording_launch(monkeypatch)
    worker = Actor(story.new_row_id("worker dispatch --model sonnet --plan 1 --phase 1", actor=story.agent), ActorType.AGENT)
    story.run_listeners()
    expect_marks_text(story, f"Worker {worker.id} was handed plan 1")


def test_a_dispatch_for_one_task_shows_no_plan_handed_over(new_story, monkeypatch):
    story = planned_story(new_story)
    recording_launch(monkeypatch)
    story.run("worker dispatch --model sonnet 1", actor=story.agent)
    story.run_listeners()
    expect_absent_marks_text(story, "was handed plan")
