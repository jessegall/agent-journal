from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import ThreeTasks

REVIEW_REQUEST = "review request task 1 --points 2 --environment main"
REVIEWER_START = "agent start s-2 claude reviewer --environment main"
REVIEWERS_ON = "setting make reviews.reviewer true"
NO_REVIEWERS = "setting make reviews.reviewers-most 0"
REVIEW_SHOW = "review show 1"
REVIEW_POINTS = "review-point list --review 1"


def reviewer_of(story: Story) -> Actor:
    """The reviewer agent ReviewTaken started: the agent after the main one."""
    return Actor(story.agent.id + 1, ActorType.AGENT)


class ReviewersOn(StoryFixture):
    """Three open tasks, and the reviewers switched on."""

    parent = ThreeTasks

    def steps(self, story: Story) -> None:
        story.run(REVIEWERS_ON)

    def expect(self, story: Story) -> None:
        story.expect_text("setting list", "reviews.reviewer  true")


class NoReviewersAllowed(StoryFixture):
    """Reviewers on, and none allowed in the project, so a review waits queued."""

    parent = ReviewersOn

    def steps(self, story: Story) -> None:
        story.run(NO_REVIEWERS)

    def expect(self, story: Story) -> None:
        story.expect_text("setting list", "reviews.reviewers-most  0")


class ReviewRequested(StoryFixture):
    """Review 1 of task 1, with two points, requested by the main agent and waiting queued."""

    parent = NoReviewersAllowed

    def steps(self, story: Story) -> None:
        story.run(REVIEW_REQUEST, actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_success(REVIEW_SHOW, "state: queued", "subject_model: task", "subject_id: 1")


class ReviewTaken(StoryFixture):
    """Review 1 given to a reviewer agent: reviewer_of(story)."""

    parent = ReviewRequested

    def steps(self, story: Story) -> None:
        story.new_row_id(REVIEWER_START)
        story.run(f"review assign 1 --reviewer-id {reviewer_of(story).id}", actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_success(REVIEW_SHOW, "state: reviewing", f"reviewer_id: {reviewer_of(story).id}")
