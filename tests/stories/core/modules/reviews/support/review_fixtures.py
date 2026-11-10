from core.base.actor import Actor
from engine.enums.actor_type import ActorType
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import ThreeTasks

REVIEW_REQUEST = "review request task 1 --points 2 --environment main"
REVIEWER_START = "agent start s-2 claude reviewer --environment main"
REVIEWERS_ENABLED = "setting make journal.core.reviews.reviewer true"
EMPTY_REVIEWERS = "setting make journal.core.reviews.reviewers-most 0"
REVIEW_DETAILS = "review show 1"
REVIEW_POINTS = "review-point list --review 1"


def read_reviewer(story: Story) -> Actor:
    """The reviewer agent ReviewTaken started: the agent after the main one."""
    return Actor(story.agent.id + 1, ActorType.AGENT)


class ReviewersEnabled(StoryFixture):
    """Three open tasks, and the reviewers switched on."""

    parent = ThreeTasks

    def steps(self, story: Story) -> None:
        story.run(REVIEWERS_ENABLED)

    def expect(self, story: Story) -> None:
        story.expect_text("setting list", "reviews.reviewer  true")


class NoReviewersAllowed(StoryFixture):
    """Reviewers on, and none allowed in the project, so a review waits queued."""

    parent = ReviewersEnabled

    def steps(self, story: Story) -> None:
        story.run(EMPTY_REVIEWERS)

    def expect(self, story: Story) -> None:
        story.expect_text("setting list", "reviews.reviewers-most  0")


class OneReviewerAllowed(StoryFixture):
    """Reviewers on, and room for one in the project."""

    parent = ReviewersEnabled

    def steps(self, story: Story) -> None:
        story.run("setting make journal.core.reviews.reviewers-most 1")

    def expect(self, story: Story) -> None:
        story.expect_text("setting list", "reviews.reviewers-most  1")


class ReviewerReview(StoryFixture):
    """Review 1 of task 1 requested while reviewers are allowed, so a reviewer was added and holds it."""

    parent = OneReviewerAllowed

    def steps(self, story: Story) -> None:
        story.run(REVIEW_REQUEST, actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_success(REVIEW_DETAILS, "state: reviewing")


class ReviewRequested(StoryFixture):
    """Review 1 of task 1, with two points, requested by the main agent and waiting queued."""

    parent = NoReviewersAllowed

    def steps(self, story: Story) -> None:
        story.run(REVIEW_REQUEST, actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_success(REVIEW_DETAILS, "state: queued", "subject_model: task", "subject_id: 1")


class ProgressReview(StoryFixture):
    """Review 1 given to a reviewer agent: reviewer_of(story)."""

    parent = ReviewRequested

    def steps(self, story: Story) -> None:
        story.new_row_id(REVIEWER_START)
        story.run(f"review assign 1 --reviewer-id {read_reviewer(story).id}", actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_success(REVIEW_DETAILS, "state: reviewing", f"reviewer_id: {read_reviewer(story).id}")
