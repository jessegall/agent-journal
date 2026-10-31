from tests.stories.core.support import story_lines as lines
from core.modules.tasks.task import Task, TaskState
from tests.stories.core.support.reviews_samples import Review, ReviewState
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import AssignedTask

REVIEWS = "tests.stories.core.support.reviews_samples:ReviewsModule"


class ReviewRequested(StoryFixture):
    """With the reviews plugin loaded: the task held by the agent, and a review of it requested."""

    parent = AssignedTask

    def steps(self, story: Story) -> None:
        story.run("review make 1")

    def expect(self, story: Story) -> None:
        story.expect_success("review show 1", "task_id: 1", "state: requested")


def reviewed_task_story(new_story):
    return new_story(REVIEWS, fixture=ReviewRequested)


def test_a_task_waits_for_its_review_before_it_closes(new_story):
    story = reviewed_task_story(new_story)
    story.expect_refusal(lines.TASK_CLOSE, "refused by reviews.task-closes-after-its-review: task 1 waits for its review", actor=story.agent)
    story.expect_success("review passed 1", "state: passed")
    story.expect_success(lines.TASK_CLOSE, "state: completed", actor=story.agent)
    story.expect_rows(story.row(Task, 1).state is TaskState.COMPLETED, story.row(Review, 1).state is ReviewState.PASSED)


def test_a_failed_review_takes_its_note_and_the_refusal_is_recorded(new_story):
    story = reviewed_task_story(new_story)
    story.run(lines.TASK_CLOSE, actor=story.agent)
    story.expect_success('review failed 1 --note "the total is still wrong"', "state: failed", "note: the total is still wrong")
    story.expect_rows([refusal.guard for refusal in story.refusals()] == ["reviews.task-closes-after-its-review"])
