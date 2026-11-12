from engine.database.database import Database
from engine.database.statement import Statement
from core.modules.reviews.migrations.m006_review_assignments import ReviewAssignmentsMigration
from core.modules.reviews.reviews_module import ReviewsModule
from tests.stories.core.modules.reviews.support.review_fixtures import REVIEW_DETAILS, ProgressReview, ReviewerReview, read_reviewer, review_assignees


def review_columns(story) -> list[str]:
    return [str(row["name"]) for row in story.container.get(Database).rows(Statement("PRAGMA table_info(reviews)"))]


def test_the_assign_move_of_a_review_also_assigns_the_reviewer(new_story):
    story = new_story(fixture=ProgressReview)
    story.expect_text("assignment list --subject-model review --subject 1", "review", str(read_reviewer(story).id), actor=story.agent)
    story.expect_rows(review_assignees(story) == [read_reviewer(story).id], detail=str(review_assignees(story)))


def test_only_the_assigned_reviewer_reports(new_story):
    story = new_story(fixture=ProgressReview)
    story.expect_refusal('review record "1 passed\n2 passed" --review 1 --environment main', "has another reviewer", actor=story.agent)
    story.expect_success('review record "1 passed\n2 passed" --review 1', actor=read_reviewer(story))
    story.expect_success(REVIEW_DETAILS, "state: approved")


def test_a_reviewer_that_ends_loses_the_assignment(new_story):
    story = new_story(fixture=ReviewerReview)
    story.run(f"agent end {read_reviewer(story).id}")
    story.expect_success(REVIEW_DETAILS, "state: abandoned")
    story.expect_rows(review_assignees(story) == [], detail=str(review_assignees(story)))


def test_the_migration_moves_reviewer_id_into_the_pivot_and_drops_the_column(new_story):
    story = new_story(fixture=ReviewerReview)
    reviewer = read_reviewer(story)
    story.expect_success("unassign review 1 --environment main", actor=story.agent)
    database = story.container.get(Database)
    database.update(Statement("ALTER TABLE reviews ADD COLUMN reviewer_id INTEGER"))
    database.update(Statement(f"UPDATE reviews SET reviewer_id = {reviewer.id} WHERE id = 1"))
    database.update(Statement("DELETE FROM migrations WHERE module = ? AND number = ?", [ReviewsModule.name, ReviewAssignmentsMigration.number]))
    code, output_text = story.synced()
    story.expect_rows(code == 0, "reviewer_id" not in review_columns(story), review_assignees(story) == [reviewer.id], detail=f"{output_text} {review_assignees(story)}")
