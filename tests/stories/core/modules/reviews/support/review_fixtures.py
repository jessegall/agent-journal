from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import ThreeTasks

REVIEW_REQUEST = "review request task 1 --points 2 --environment main"
REVIEWER_START = "agent start s-2 claude reviewer --environment main"
REVIEW_SHOW = "review show 1"
REVIEW_POINTS = "review-point list --review 1"


class ReviewRequested(StoryFixture):
    """Review 1 of task 1, with two points, requested by the main agent and waiting queued."""

    parent = ThreeTasks

    def steps(self, story: Story) -> None:
        story.run(REVIEW_REQUEST, actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_success(REVIEW_SHOW, "state: queued", "subject: task 1")


class ReviewTaken(StoryFixture):
    """Review 1 given to a reviewer agent: story.reviewer."""

    parent = ReviewRequested

    def steps(self, story: Story) -> None:
        story.reviewer = Actor(story.new_row_id(REVIEWER_START), ActorType.AGENT)
        story.run(f"review assign 1 --reviewer {story.reviewer.id}", actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_success(REVIEW_SHOW, "state: in_progress", f"reviewer_id: {story.reviewer.id}")
