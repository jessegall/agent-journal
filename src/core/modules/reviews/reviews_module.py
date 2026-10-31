from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.reviews.commands.abandon_review import AbandonReview
from core.modules.reviews.commands.request_review_subcommand import RequestReviewSubcommand
from core.modules.reviews.guards.one_open_review_per_subject_guard import OneOpenReviewPerSubjectGuard
from core.modules.reviews.migrations.m001_reviews import ReviewsTablesMigration
from core.modules.reviews.models.review import Review
from core.modules.reviews.models.review_point import ReviewPoint
from core.modules.reviews.queries.review_query import ReviewQuery


class ReviewsModule(Module):
    """Adds reviews, requests to have a row's work checked point by point by a reviewer."""

    name = "journal.core.reviews"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents"]
    models = (ModelDeclaration(Review, query=ReviewQuery, commands=(AbandonReview,)), ModelDeclaration(ReviewPoint))
    migrations = [ReviewsTablesMigration]
    subcommands = (RequestReviewSubcommand,)
    guards = [OneOpenReviewPerSubjectGuard]
