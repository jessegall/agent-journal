import json

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import ThreeTasks
from core.modules.reviews.support.review_settings import REVIEWERS_MOST_SETTING
from core.modules.reviews.support.review_settings import REVIEWER_SETTING

REVIEW_REQUEST = "review request task 1 --points 2 --environment main"
REVIEWER_START = "agent start s-2 claude reviewer --environment main"
REVIEWERS_ENABLED = f"setting set {REVIEWER_SETTING} true --project"
EMPTY_REVIEWERS = f"setting set {REVIEWERS_MOST_SETTING} 0 --project"
REVIEW_DETAILS = "review show 1"
REVIEW_POINTS = "review-point list --review 1"
REVIEW_ASSIGNMENTS = "assignment list --subject-model review --subject 1 --json"


def review_assignees(story: Story) -> list[int]:
    """The actors review 1 is assigned to: its reviewer, once one took it."""
    return [assignment["actor_id"] for assignment in json.loads(story.run(REVIEW_ASSIGNMENTS, actor=story.agent).output_text)["rows"]]


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
        story.run(f"setting set {REVIEWERS_MOST_SETTING} 1 --project")

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
        story.expect_success(REVIEW_DETAILS, "state: reviewing")
        story.expect_rows(review_assignees(story) == [read_reviewer(story).id], detail=str(review_assignees(story)))
