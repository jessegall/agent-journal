from tests.stories.core.support import story_lines as lines
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.enums.task_state import TaskState
from tests.stories.core.support.signoffs_samples import Signoff, SignoffState
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import AssignedTask

SIGNOFFS = "tests.stories.core.support.signoffs_samples:SignoffsModule"


class SignoffRequested(StoryFixture):
    """With the signoffs plugin loaded: the task held by the agent, and a signoff of it requested."""

    parent = AssignedTask

    def steps(self, story: Story) -> None:
        story.run("signoff make 1")

    def expect(self, story: Story) -> None:
        story.expect_success("signoff show 1", "task_id: 1", "state: requested")


def signed_task_story(new_story):
    return new_story(SIGNOFFS, fixture=SignoffRequested)


def test_a_task_waits_for_its_signoff_before_it_closes(new_story):
    story = signed_task_story(new_story)
    story.expect_refusal(lines.TASK_CLOSE, "refused by signoffs.task-closes-after-its-signoff: task 1 waits for its signoff", actor=story.agent)
    story.expect_success("signoff passed 1", "state: passed")
    story.expect_success(lines.TASK_CLOSE, "state: completed", actor=story.agent)
    story.expect_rows(story.row(Task, 1).state is TaskState.COMPLETED, story.row(Signoff, 1).state is SignoffState.PASSED)


def test_a_failed_signoff_takes_its_note_and_the_refusal_is_recorded(new_story):
    story = signed_task_story(new_story)
    story.run(lines.TASK_CLOSE, actor=story.agent)
    story.expect_success('signoff failed 1 --note "the total is still wrong"', "state: failed", "note: the total is still wrong")
    story.expect_rows([refusal.guard for refusal in story.refusals()] == ["signoffs.task-closes-after-its-signoff"])
