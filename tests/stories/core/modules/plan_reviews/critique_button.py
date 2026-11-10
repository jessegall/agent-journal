from unittest.mock import patch

from engine.registry.registry import Registry
from core.modules import DEFAULT_MODULES
from core.modules.plan_reviews.plan_reviews_module import PlanReviewsModule
from engine.testing.expectations.expect_row import expect_row
from tests.stories.core.modules.plan_reviews.review_state import CRITIQUE_COMMAND, ReviewPlan
from tests.stories.core.support.fixtures import UserJoined

UNMODIFIED = tuple(module for module in DEFAULT_MODULES if module is not PlanReviewsModule)


def read_buttons(story) -> dict:
    return {entry.declaration.name: entry for entry in story.container.get(Registry).buttons}


def test_the_critique_buttons_and_the_state_belong_to_the_mod_not_to_plans_or_templates(new_story):
    story = new_story(fixture=UserJoined)
    buttons = read_buttons(story)
    expect_row(buttons["plan_reviews.critique"], module="journal.core.plan_reviews", shipped=True)
    expect_row(buttons["plan_reviews.end-review"], module="journal.core.plan_reviews", shipped=True)
    story.expect_rows("templates.critique" not in buttons, "templates.end-review" not in buttons)
    additions = {addition.state: addition.module for addition in story.container.get(Registry).state_additions}
    story.expect_rows(additions["reviewing"] == "journal.core.plan_reviews")


def test_the_general_critique_template_stays_with_templates(new_story):
    story = new_story(fixture=UserJoined)
    template = next(entry for entry in story.container.get(Registry).templates if entry.declaration.title == "General critique")
    expect_row(template, module="journal.core.templates")


def test_plans_work_with_the_mod_left_out_and_a_plan_under_review_falls_to_ready(new_story):
    story = new_story(fixture=ReviewPlan)
    story.expect_success('plan make "Another plan" --environment main')
    with patch("core.modules.DEFAULT_MODULES", UNMODIFIED):
        code, report = story.synced()
        story.expect_rows(code == 0, "1 plan rows left the state reviewing and are ready" in report)
        story.expect_text("plan show 1", "state: ready")
        story.expect_success(CRITIQUE_COMMAND, actor=story.user)
        story.expect_text("plan show 1", "state: ready")
        story.expect_success("plan ready 2")
        story.expect_success("plan approve 2 --environment main", actor=story.user)
        story.expect_success("plan start 2 --environment main", actor=story.user)
        story.expect_usage_error("plan rounds 1")
        buttons = read_buttons(story)
        windows = [window.name for window in story.container.get(Registry).windows]
        story.expect_rows("plan_reviews.critique" not in buttons, "plan_reviews.rounds" not in windows, "plans.approve" in buttons)
