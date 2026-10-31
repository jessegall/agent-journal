from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.fixtures import PlanWithCheckpoint


def test_a_task_inside_a_checkpoint_phase_is_started_next(new_story):
    story = new_story(fixture=PlanWithCheckpoint)
    story.run(lines.TASK_START, actor=story.agent)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.expect_success(lines.THIRD_TASK_DETAILS, "state: started", f"holder_id: {story.agent.id}")


def test_no_task_after_a_checkpoint_phase_starts_while_the_checkpoint_phase_has_an_open_task(new_story):
    story = new_story(fixture=PlanWithCheckpoint)
    story.run(lines.TASK_START, actor=story.agent)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run('task close 3 --outcome "done"', actor=story.agent)
    story.expect_success("task show 4", "state: open")
