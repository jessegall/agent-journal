import json

from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import BuilderStarted


def scored_plan(story, *scores: int | None) -> None:
    story.run(lines.NEW_PLAN)
    story.run('phase make --plan 1 "Build"')
    for number, score in enumerate(scores, 1):
        flag = "" if score is None else f" --complexity {score}"
        task_id = story.new_row_id(f'task make "Part {number}" --environment main{flag}')
        story.run(f"phase place {task_id} --phase 1")


def test_a_plan_shows_the_average_complexity_of_its_scored_tasks(new_story):
    story = new_story(fixture=BuilderStarted)
    scored_plan(story, 2, 3, 5)
    story.expect_text("plan inspect 1", "complexity 3.3", actor=story.agent)
    inspected = json.loads(story.run("plan inspect 1 --json", actor=story.agent).output_text)
    progress = json.loads(story.run("plan progress 1 --json", actor=story.agent).output_text)
    story.expect_rows(inspected["complexity"] == 3.3, progress["complexity"] == 3.3, detail=f"{inspected.get('complexity')} {progress}")


def test_a_plan_whose_tasks_are_not_scored_shows_no_complexity(new_story):
    story = new_story(fixture=BuilderStarted)
    scored_plan(story, None, None)
    output = story.run("plan inspect 1", actor=story.agent).output_text
    inspected = json.loads(story.run("plan inspect 1 --json", actor=story.agent).output_text)
    story.expect_rows("complexity" not in output, inspected["complexity"] is None, detail=output)
