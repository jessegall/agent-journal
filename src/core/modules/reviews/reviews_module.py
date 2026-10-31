from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.reviews.migrations.m001_reviews import ReviewsTablesMigration
from core.modules.reviews.models.review import Review


class ReviewsModule(Module):
    """Adds reviews, requests to have a row's work checked point by point by a reviewer."""

    name = "journal.core.reviews"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents"]
    models = (ModelDeclaration(Review),)
    migrations = [ReviewsTablesMigration]
