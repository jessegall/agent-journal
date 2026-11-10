import json
from datetime import timedelta

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.fixtures import CheckpointPlan, UserJoined
from tests.stories.support.story_checks import expect_index, expect_lines_2


def test_the_outline_brings_each_phase_with_its_tasks_in_one_answer(new_story):
    story = new_story(fixture=CheckpointPlan)
    answer = json.loads(story.run("plan outline 1 --json", actor=story.agent).output_text)
    expect_phases_answer(answer)
    expect_tasks_phases_answer("tasks", "title", answer)
    expect_tasks_phase_phases({"id", "title", "state", "priority", "complexity", "tags", "reason", "automatic", "delegated_to", "main_delegate", "helper_id", "helper_name", "helper_main"}, answer)


def test_the_board_brings_the_open_plans_cards_and_its_counts_in_one_answer(new_story):
    story = new_story(fixture=UserJoined)
    story.run('plan make "The rebuild" --brief "all of it" --environment main', actor=story.agent)
    story.expect_text("plan board --environment main", "1 open, 0 started, 0 closed", actor=story.user)
    story.expect_text("plan board --environment main --json", "The rebuild", actor=story.user)


def test_the_plan_board_pages_older_plans_by_id(new_story):
    story = new_story(fixture=UserJoined)
    for title in ("First plan", "Second plan"):
        story.run(f'plan make "{title}" --environment main', actor=story.user)
    older = story.run("plan board --environment main --before-id 2 --json", actor=story.user)
    older.expect_text("First plan")
    older.expect_no_text("Second plan")
    newest = story.run("plan board --environment main --limit 1 --json", actor=story.user)
    newest.expect_text("Second plan")
    newest.expect_no_text("First plan")


def test_the_timeline_says_when_each_task_was_made_logged_and_ended_newest_first(new_story):
    story = new_story(fixture=CheckpointPlan)
    story.advance(timedelta(seconds=5))
    story.run(lines.TASK_START, actor=story.agent)
    story.run('task log 1 "The cart adds up"', actor=story.agent)
    story.advance(timedelta(seconds=5))
    story.run('task close 1 --outcome "Cart works"', actor=story.agent)
    text = story.run("plan timeline 1", actor=story.agent).output_text
    expect_index(text, "completed  task 1  Cart works", "logged  task 1  The cart adds up", "made  task 1")


def test_a_plan_with_nothing_placed_has_an_empty_timeline(new_story):
    story = new_story(fixture=UserJoined)
    story.run('plan make "Empty plan" --environment main', actor=story.user)
    story.expect_text("plan timeline 1", "nothing yet", actor=story.user)


def test_the_outline_names_the_worker_holding_a_task_and_not_the_main_agent(new_story):
    story = new_story(fixture=CheckpointPlan)
    worker = Actor(story.new_row_id("agent start s-worker claude worker --environment main"), ActorType.AGENT)
    story.run(lines.TASK_START, actor=worker)
    story.run("task start 2", actor=story.agent)
    phases = json.loads(story.run("plan inspect 1 --json", actor=story.agent).output_text)["phases"]
    holders = {task["id"]: task["helper_id"] for phase in phases for task in phase["tasks"]}
    expect_lines_2(holders, worker.id)
    expect_holders(holders, None)


def test_a_plan_whose_tasks_the_main_agent_holds_is_not_delegated(new_story):
    story = new_story(fixture=CheckpointPlan)
    story.run(lines.TASK_START, actor=story.agent)
    outline = json.loads(story.run("plan outline 1 --json", actor=story.agent).output_text)
    expect_delegated(outline, False, [])


def expect_delegated(answer, delegated, agents) -> None:
    actual = (answer["delegated"], [(agent["id"], agent["task_id"]) for agent in answer["agents"]])
    assert actual == (delegated, agents), actual


def expect_holders(holders, expected) -> None:
    actual = holders[2]
    assert actual is expected, actual


def expect_tasks_phase_phases(keys, answer) -> None:
    actual = any((phase['tasks'] and keys == set(phase['tasks'][0]) for phase in answer['phases']))
    assert actual, actual


def expect_phases_answer(answer) -> None:
    actual = answer['phases']
    assert actual, actual


def expect_tasks_phases_answer(text, text_2, answer) -> None:
    actual = all((text in phase and text_2 in phase for phase in answer['phases']))
    assert actual, actual
