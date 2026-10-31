from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import ThreeTasks

REVIEW_REQUEST = "review request task 1 --points 2 --environment main"
REVIEWER_START = "agent start s-2 claude reviewer --environment main"
NO_REVIEWERS = "setting make reviews.reviewers-most 0"
REVIEW_SHOW = "review show 1"
REVIEW_POINTS = "review-point list --review 1"


class NoReviewersAllowed(StoryFixture):
    """Three open tasks, and no reviewer allowed in the project, so a review waits queued."""

    parent = ThreeTasks

    def steps(self, story: Story) -> None:
        story.run(NO_REVIEWERS)

    def expect(self, story: Story) -> None:
        story.expect_success("setting list", "reviews.reviewers-most")


class ReviewRequested(StoryFixture):
    """Review 1 of task 1, with two points, requested by the main agent and waiting queued."""

    parent = NoReviewersAllowed

    def steps(self, story: Story) -> None:
        story.run(REVIEW_REQUEST, actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_success(REVIEW_SHOW, "state: queued", "subject_model: task", "subject_id: 1")


class ReviewTaken(StoryFixture):
    """Review 1 given to a reviewer agent: story.reviewer."""

    parent = ReviewRequested

    def steps(self, story: Story) -> None:
        story.reviewer = Actor(story.new_row_id(REVIEWER_START), ActorType.AGENT)
        story.run(f"review assign 1 --reviewer-id {story.reviewer.id}", actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_success(REVIEW_SHOW, "state: reviewing", f"reviewer_id: {story.reviewer.id}")
