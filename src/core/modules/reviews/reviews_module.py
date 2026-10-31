from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.modules.reviews.commands.assign_next_review_handler import AssignNextReviewHandler
from core.modules.reviews.commands.start_reviewer import StartReviewer
from core.modules.reviews.listeners.review_queued_listener import ReviewQueuedListener
from core.modules.reviews.listeners.reviewer_available_listener import ReviewerAvailableListener
from core.modules.reviews.commands.abandon_review import AbandonReview
from core.modules.reviews.commands.end_reviewer import EndReviewer
from core.modules.reviews.listeners.review_reported_step_listener import ReviewReportedStepListener
from core.modules.reviews.listeners.review_started_step_listener import ReviewStartedStepListener
from core.modules.reviews.listeners.review_reported_mark_listener import ReviewReportedMarkListener
from core.modules.reviews.listeners.review_started_mark_listener import ReviewStartedMarkListener
from core.modules.reviews.support.review_marks import REVIEW_MARKS
from core.modules.reviews.listeners.reviewer_ended_listener import ReviewerEndedListener
from core.modules.reviews.commands.reviewer_list_subcommand import ReviewerListSubcommand
from core.modules.reviews.commands.add_reviewer_handler import AddReviewerHandler
from core.modules.reviews.commands.add_reviewer_subcommand import AddReviewerSubcommand
from core.modules.reviews.commands.retire_reviewer_handler import RetireReviewerHandler
from core.modules.reviews.commands.retire_reviewer_subcommand import RetireReviewerSubcommand
from core.modules.reviews.guards.reviewers_enabled_guard import ReviewersEnabledGuard
from core.modules.reviews.guards.reviewers_most_guard import ReviewersMostGuard
from core.modules.reviews.queries.reviewer_query import ReviewerQuery
from core.modules.reviews.commands.request_review_subcommand import RequestReviewSubcommand
from core.modules.reviews.commands.assign_review import AssignReview
from core.modules.reviews.commands.record_review_handler import RecordReviewHandler
from core.modules.reviews.commands.record_review_subcommand import RecordReviewSubcommand
from core.modules.reviews.guards.reporter_is_reviewer_guard import ReporterIsReviewerGuard
from core.modules.reviews.guards.one_open_review_per_subject_guard import OneOpenReviewPerSubjectGuard
from core.modules.reviews.migrations.m001_reviews import ReviewsTablesMigration
from core.modules.reviews.migrations.m002_reviewers import ReviewersTableMigration
from core.modules.reviews.migrations.m003_review_steps import ReviewStepsTableMigration
from core.modules.reviews.models.review import Review
from core.modules.reviews.models.review_step import ReviewStep
from core.modules.reviews.models.reviewer import Reviewer
from core.modules.reviews.models.review_point import ReviewPoint
from core.modules.reviews.queries.review_query import ReviewQuery
from core.modules.reviews.support.review_settings import REVIEW_SETTINGS
from core.modules.reviews.seeders.reviews_seeder import ReviewsSeeder


class ReviewsModule(Module):
    """Adds reviews, requests to have a row's work checked point by point by a reviewer."""

    name = "journal.core.reviews"
    requires_core = ">=5,<6"
    settings = REVIEW_SETTINGS
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.settings", "journal.core.chat"]
    models = (ModelDeclaration(Review, query=ReviewQuery, commands=(AssignReview, AbandonReview)), ModelDeclaration(ReviewPoint), ModelDeclaration(ReviewStep, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(Reviewer, query=ReviewerQuery, commands=(StartReviewer, EndReviewer), excluded_subcommands=["make", "edit", "delete"]))
    migrations = [ReviewsTablesMigration, ReviewersTableMigration, ReviewStepsTableMigration]
    subcommands = (RequestReviewSubcommand, RecordReviewSubcommand, AddReviewerSubcommand, RetireReviewerSubcommand, ReviewerListSubcommand)
    guards = [OneOpenReviewPerSubjectGuard, ReporterIsReviewerGuard, ReviewersEnabledGuard, ReviewersMostGuard]
    handlers = [RecordReviewHandler, AddReviewerHandler, RetireReviewerHandler, AssignNextReviewHandler]
    listeners = [ReviewQueuedListener, ReviewerAvailableListener, ReviewerEndedListener, ReviewStartedStepListener, ReviewReportedStepListener, ReviewStartedMarkListener, ReviewReportedMarkListener]
    marks = REVIEW_MARKS
    windows = [WindowDeclaration("reviews.reviewer", "Reviewer", "reviewer.js", WindowLoading.COMPONENT, icon=WindowIcon.REVIEW,
                                 reads=["review list", "review show", "review-step list", "reviewer list"], events=["review.*", "review_step.*", "reviewer.*"])]
    seeders = [ReviewsSeeder]
