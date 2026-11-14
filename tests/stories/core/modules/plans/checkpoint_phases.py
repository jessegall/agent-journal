from engine.testing.stories.story_fixture import StoryFixture

from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.fixtures import CheckpointPlan


def test_the_task_a_checkpoint_phase_waits_on_is_started_next_and_then_the_phases_own_tasks_in_order(new_story):
    story = new_story(fixture=CompletedCheckpointTask)
    story.expect_success("task show 5", "state: started", f"holder_id: {story.agent.id}")
    story.run('task close 5 --outcome "done"', actor=story.agent)
    story.expect_success("task show 2", "state: started", f"holder_id: {story.agent.id}")


def test_no_task_after_a_checkpoint_phase_starts_while_the_checkpoint_phase_has_an_open_task(new_story):
    story = new_story(fixture=CompletedCheckpointTask)
    story.run('task close 3 --outcome "done"', actor=story.agent)
    story.expect_success("task show 4", "state: open")


class CompletedCheckpointTask(StoryFixture):
    parent = CheckpointPlan

    def steps(self, story):
        story.run(lines.TASK_START, actor=story.agent)
        story.run('task close 1 --outcome "done"', actor=story.agent)
