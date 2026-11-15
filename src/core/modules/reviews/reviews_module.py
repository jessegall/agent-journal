from core.modules.reviews.models.declarations.review_model_declaration import ReviewModelDeclaration
from core.modules.reviews.models.declarations.review_step_model_declaration import ReviewStepModelDeclaration
from core.modules.reviews.models.declarations.reviewer_model_declaration import ReviewerModelDeclaration
from core.modules.reviews.windows.reviews_windows import REVIEWS_WINDOWS
from core.modules.reviews.migrations.m005_review_state_index import ReviewStateIndexMigration
from core.modules.reviews.migrations.m004_reviewer_environment_index import ReviewerEnvironmentIndexMigration
from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
from core.modules.reviews.commands.assign_next_review.assign_next_review_handler import AssignNextReviewHandler
from core.modules.reviews.listeners.review_queued_listener import ReviewQueuedListener
from core.modules.reviews.listeners.reviewer_available_listener import ReviewerAvailableListener
from core.modules.reviews.listeners.review_reported_step_listener import ReviewReportedStepListener
from core.modules.reviews.listeners.review_started_step_listener import ReviewStartedStepListener
from core.modules.reviews.listeners.review_reported_mark_listener import ReviewReportedMarkListener
from core.modules.reviews.listeners.review_started_mark_listener import ReviewStartedMarkListener
from core.modules.reviews.marks.review_mark import ReviewMark
from core.modules.reviews.listeners.reviewer_ended_listener import ReviewerEndedListener
from core.modules.reviews.commands.reviewer_list.reviewer_list_subcommand import ReviewerListSubcommand
from core.modules.reviews.commands.add_reviewer.add_reviewer_handler import AddReviewerHandler
from core.modules.reviews.commands.add_reviewer.add_reviewer_subcommand import AddReviewerSubcommand
from core.modules.reviews.commands.retire_reviewer.retire_reviewer_handler import RetireReviewerHandler
from core.modules.reviews.commands.retire_reviewer.retire_reviewer_subcommand import RetireReviewerSubcommand
from core.modules.reviews.guards.reviewers_enabled_guard import ReviewersEnabledGuard
from core.modules.reviews.guards.reviewers_most_guard import ReviewersMostGuard
from core.modules.reviews.commands.request_review.request_review_subcommand import RequestReviewSubcommand
from core.modules.reviews.commands.assign_review.assign_review_handler import AssignReviewHandler
from core.modules.reviews.listeners.review_abandoned_listener import ReviewAbandonedListener
from core.modules.reviews.migrations.m006_review_assignments import ReviewAssignmentsMigration
from core.modules.reviews.commands.record_review.record_review_handler import RecordReviewHandler
from core.modules.reviews.commands.record_review.record_review_subcommand import RecordReviewSubcommand
from core.modules.reviews.guards.reporter_is_reviewer_guard import ReporterIsReviewerGuard
from core.modules.reviews.guards.one_open_review_per_subject_guard import OneOpenReviewPerSubjectGuard
from core.modules.reviews.migrations.m001_reviews import ReviewsTablesMigration
from core.modules.reviews.migrations.m002_reviewers import ReviewersTableMigration
from core.modules.reviews.migrations.m003_review_steps import ReviewStepsTableMigration
from core.modules.reviews.models.review_point import ReviewPoint
from core.modules.reviews.support.review_settings import REVIEW_SETTINGS
from core.modules.reviews.seeders.reviews_seeder import ReviewsSeeder
from core.modules.reviews.models.reviewer_row import ReviewerRow
from core.modules.reviews.commands.review_board.review_board_subcommand import ReviewBoardSubcommand
from core.modules.reviews.commands.review_board.review_step_board_subcommand import ReviewStepBoardSubcommand


class ReviewsModule(Module):
    """Adds reviews, requests to have a row's work checked point by point by a reviewer."""

    name = "journal.core.reviews"
    move_reason = "version 4 kept plan reviews in plan_reviews, which the plans module moves"
    requires_engine = ">=5,<6"
    settings = REVIEW_SETTINGS
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.settings", "journal.core.chat", "journal.core.plans", "journal.core.drivers", "journal.core.assignments"]
    models = [ReviewModelDeclaration, ModelDeclaration(ReviewPoint), ReviewStepModelDeclaration, ReviewerModelDeclaration]
    migrations = [ReviewAssignmentsMigration, ReviewStateIndexMigration, ReviewerEnvironmentIndexMigration, ReviewsTablesMigration, ReviewersTableMigration, ReviewStepsTableMigration]
    views = [ReviewerRow]
    subcommands = [ReviewBoardSubcommand, ReviewStepBoardSubcommand, RequestReviewSubcommand, RecordReviewSubcommand, AddReviewerSubcommand, RetireReviewerSubcommand, ReviewerListSubcommand]
    guards = [OneOpenReviewPerSubjectGuard, ReporterIsReviewerGuard, ReviewersEnabledGuard, ReviewersMostGuard]
    handlers = [AssignReviewHandler, RecordReviewHandler, AddReviewerHandler, RetireReviewerHandler, AssignNextReviewHandler]
    listeners = [ReviewQueuedListener, ReviewerAvailableListener, ReviewerEndedListener, ReviewStartedStepListener, ReviewReportedStepListener, ReviewStartedMarkListener, ReviewReportedMarkListener, ReviewAbandonedListener]
    marks = [ReviewMark]
    windows = REVIEWS_WINDOWS
    seeders = [ReviewsSeeder]
