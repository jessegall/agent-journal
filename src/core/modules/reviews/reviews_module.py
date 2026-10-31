from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.reviews.commands.assign_next_review_handler import AssignNextReviewHandler
from core.modules.reviews.commands.take_reviewer import TakeReviewer
from core.modules.reviews.listeners.review_queued_listener import ReviewQueuedListener
from core.modules.reviews.listeners.reviewer_idle_listener import ReviewerIdleListener
from core.modules.reviews.commands.add_reviewer_handler import AddReviewerHandler
from core.modules.reviews.commands.add_reviewer_subcommand import AddReviewerSubcommand
from core.modules.reviews.commands.retire_reviewer_handler import RetireReviewerHandler
from core.modules.reviews.commands.retire_reviewer_subcommand import RetireReviewerSubcommand
from core.modules.reviews.guards.reviewer_is_on_guard import ReviewerIsOnGuard
from core.modules.reviews.guards.reviewers_most_guard import ReviewersMostGuard
from core.modules.reviews.queries.reviewer_query import ReviewerQuery
from core.modules.reviews.commands.request_review_subcommand import RequestReviewSubcommand
from core.modules.reviews.commands.assign_review import AssignReview
from core.modules.reviews.commands.record_review_handler import RecordReviewHandler
from core.modules.reviews.commands.record_review_subcommand import RecordReviewSubcommand
from core.modules.reviews.guards.recorded_by_its_reviewer_guard import RecordedByItsReviewerGuard
from core.modules.reviews.guards.one_open_review_per_subject_guard import OneOpenReviewPerSubjectGuard
from core.modules.reviews.migrations.m001_reviews import ReviewsTablesMigration
from core.modules.reviews.migrations.m002_reviewers import ReviewersTableMigration
from core.modules.reviews.models.review import Review
from core.modules.reviews.models.reviewer import Reviewer
from core.modules.reviews.models.review_point import ReviewPoint
from core.modules.reviews.queries.review_query import ReviewQuery


class ReviewsModule(Module):
    """Adds reviews, requests to have a row's work checked point by point by a reviewer."""

    name = "journal.core.reviews"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.settings"]
    models = (ModelDeclaration(Review, query=ReviewQuery, commands=(AssignReview,)), ModelDeclaration(ReviewPoint), ModelDeclaration(Reviewer, query=ReviewerQuery, commands=(TakeReviewer,), excluded_subcommands=["make", "edit", "delete"]))
    migrations = [ReviewsTablesMigration, ReviewersTableMigration]
    subcommands = (RequestReviewSubcommand, RecordReviewSubcommand, AddReviewerSubcommand, RetireReviewerSubcommand)
    guards = [OneOpenReviewPerSubjectGuard, RecordedByItsReviewerGuard, ReviewerIsOnGuard, ReviewersMostGuard]
    handlers = [RecordReviewHandler, AddReviewerHandler, RetireReviewerHandler, AssignNextReviewHandler]
    listeners = [ReviewQueuedListener, ReviewerIdleListener]
