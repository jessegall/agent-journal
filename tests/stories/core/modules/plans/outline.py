import json

from tests.stories.core.support.fixtures import PlanWithCheckpoint, UserJoined


def test_the_outline_brings_each_phase_with_its_tasks_in_one_answer(new_story):
    story = new_story(fixture=PlanWithCheckpoint)
    answer = json.loads(story.run("plan outline 1 --json", actor=story.agent).output_text)
    assert answer["phases"] and all("tasks" in phase and "title" in phase for phase in answer["phases"])
    assert any(phase["tasks"] and {"id", "title", "state"} == set(phase["tasks"][0]) for phase in answer["phases"])


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
