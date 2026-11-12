import json

from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import BuilderStarted

SCORES = (2, 3, 5)


def test_a_plan_shows_the_average_complexity_of_its_scored_tasks_worked_out_at_each_read(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run(lines.NEW_PLAN)
    story.run('phase make --plan 1 "Build"')
    task_ids = [story.new_row_id(f'task make "Part {number}" --environment main') for number in range(1, len(SCORES) + 1)]
    for task_id in task_ids:
        story.run(f"phase place {task_id} --phase 1")
    unscored = story.run("plan inspect 1", actor=story.agent).output_text
    story.expect_rows("complexity" not in unscored, json.loads(story.run("plan inspect 1 --json", actor=story.agent).output_text)["complexity"] is None, detail=unscored)
    for task_id, score in zip(task_ids, SCORES):
        story.run(f"task edit {task_id} --complexity {score}")
    story.expect_text("plan inspect 1", "complexity 3.3", actor=story.agent)
    inspected = json.loads(story.run("plan inspect 1 --json", actor=story.agent).output_text)
    progress = json.loads(story.run("plan progress 1 --json", actor=story.agent).output_text)
    story.expect_rows(inspected["complexity"] == 3.3, progress["complexity"] == 3.3, detail=f"{inspected.get('complexity')} {progress}")
