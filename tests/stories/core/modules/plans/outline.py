import json
from datetime import timedelta

from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.fixtures import PlanWithCheckpoint, UserJoined


def test_the_outline_brings_each_phase_with_its_tasks_in_one_answer(new_story):
    story = new_story(fixture=PlanWithCheckpoint)
    answer = json.loads(story.run("plan outline 1 --json", actor=story.agent).output_text)
    assert answer["phases"] and all("tasks" in phase and "title" in phase for phase in answer["phases"])
    assert any(phase["tasks"] and {"id", "title", "state", "worker_id"} == set(phase["tasks"][0]) for phase in answer["phases"])


def test_the_board_brings_the_open_plans_cards_and_both_counts_in_one_answer(new_story):
    story = new_story(fixture=UserJoined)
    story.run('plan make "The rebuild" --brief "all of it" --environment main', actor=story.agent)
    story.expect_text("plan board --environment main", "1 open, 0 closed", actor=story.user)
    assert "The rebuild" in story.run("plan board --environment main --json", actor=story.user).output_text


def test_the_plan_board_pages_older_plans_by_id(new_story):
    story = new_story(fixture=UserJoined)
    for title in ("First plan", "Second plan"):
        story.run(f'plan make "{title}" --environment main', actor=story.user)
    older = story.run("plan board --environment main --before-id 2 --json", actor=story.user).output_text
    assert "First plan" in older and "Second plan" not in older
    newest = story.run("plan board --environment main --limit 1 --json", actor=story.user).output_text
    assert "Second plan" in newest and "First plan" not in newest


def test_the_timeline_says_when_each_task_was_made_logged_and_ended_newest_first(new_story):
    story = new_story(fixture=PlanWithCheckpoint)
    story.advance(timedelta(seconds=5))
    story.run(lines.TASK_START, actor=story.agent)
    story.run('task log 1 "The cart adds up"', actor=story.agent)
    story.advance(timedelta(seconds=5))
    story.run('task close 1 --outcome "Cart works"', actor=story.agent)
    text = story.run("plan timeline 1", actor=story.agent).output_text
    assert text.index("completed  task 1  Cart works") < text.index("logged  task 1  The cart adds up") < text.index("made  task 1")


def test_a_plan_with_nothing_placed_has_an_empty_timeline(new_story):
    story = new_story(fixture=UserJoined)
    story.run('plan make "Empty plan" --environment main', actor=story.user)
    story.expect_text("plan timeline 1", "nothing yet", actor=story.user)


def test_the_outline_names_the_worker_holding_a_task_and_not_the_main_agent(new_story):
    story = new_story(fixture=PlanWithCheckpoint)
    worker = Actor(story.new_row_id("agent start s-worker claude worker --environment main"), ActorType.AGENT)
    story.run(lines.TASK_START, actor=worker)
    story.run("task start 2", actor=story.agent)
    phases = json.loads(story.run("plan inspect 1 --json", actor=story.agent).output_text)["phases"]
    holders = {task["id"]: task["worker_id"] for phase in phases for task in phase["tasks"]}
    assert holders[1] == worker.id
    assert holders[2] is None
