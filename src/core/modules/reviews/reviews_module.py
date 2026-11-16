from core.modules.reviews.declarations.reviews_dependencies import REVIEWS_DEPENDENCIES
from core.modules.reviews.declarations.reviews_models import REVIEWS_MODELS
from core.modules.reviews.declarations.reviews_migrations import REVIEWS_MIGRATIONS
from core.modules.reviews.declarations.reviews_subcommands import REVIEWS_SUBCOMMANDS
from core.modules.reviews.declarations.reviews_guards import REVIEWS_GUARDS
from core.modules.reviews.declarations.reviews_handlers import REVIEWS_HANDLERS
from core.modules.reviews.declarations.reviews_listeners import REVIEWS_LISTENERS
from core.modules.reviews.windows.reviews_windows import REVIEWS_WINDOWS
from engine.module.module import Module
from core.modules.reviews.marks.review_mark import ReviewMark
from core.modules.reviews.support.review_settings import REVIEW_SETTINGS
from core.modules.reviews.seeders.reviews_seeder import ReviewsSeeder
from core.modules.reviews.models.reviewer_row import ReviewerRow


class ReviewsModule(Module):
    """Adds reviews, requests to have a row's work checked point by point by a reviewer."""

    name = "journal.core.reviews"
    move_reason = "version 4 kept plan reviews in plan_reviews, which the plans module moves"
    requires_engine = ">=5,<6"
    settings = REVIEW_SETTINGS
    dependencies = REVIEWS_DEPENDENCIES
    models = REVIEWS_MODELS
    migrations = REVIEWS_MIGRATIONS
    views = [ReviewerRow]
    subcommands = REVIEWS_SUBCOMMANDS
    guards = REVIEWS_GUARDS
    handlers = REVIEWS_HANDLERS
    listeners = REVIEWS_LISTENERS
    marks = [ReviewMark]
    windows = REVIEWS_WINDOWS
    seeders = [ReviewsSeeder]
