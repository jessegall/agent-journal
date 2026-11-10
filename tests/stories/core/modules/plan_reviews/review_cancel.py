from engine.database.database import Database
from engine.database.statement import Statement
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.chat.support.mark_samples import expect_marks_text
from tests.stories.core.modules.plan_reviews.review_state import ReviewPlan


class DockReview(StoryFixture):
    parent = ReviewPlan

    def steps(self, story) -> None:
        story.run_listeners()

    def expect(self, story) -> None:
        story.expect_text("dock-item list --state docked", "plans.waiting")
        story.expect_no_text("dock-item list --state docked", "approvals.request")


def test_cancelling_a_plan_under_review_removes_its_dock_and_shows_its_mark(new_story):
    story = new_story(fixture=DockReview)
    story.expect_success('plan cancel 1 --reason "Not needed"', actor=story.user)
    story.run_listeners()

    expect_marks_text(story, "Plan 1 cancelled")
    database = story.container.get(Database)
    story.expect_rows(not database.rows(Statement("SELECT id FROM dock_items WHERE target_model = 'plan' AND target_id = 1 AND state = 'docked'")))
    story.expect_rows(not database.rows(Statement("SELECT * FROM listener_skips WHERE listener IN ('plans.move-mark', 'plans.started-dock')")))
