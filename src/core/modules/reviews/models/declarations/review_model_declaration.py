from engine.module.model_declaration import ModelDeclaration
from core.modules.reviews.commands.abandon_review.abandon_review import AbandonReview
from core.modules.reviews.commands.assign_review.assign_review import AssignReview
from core.modules.reviews.models.review import Review
from core.modules.reviews.queries.review_query import ReviewQuery


class ReviewModelDeclaration(ModelDeclaration):
    """How the module declares Review."""

    model = Review
    query = ReviewQuery
    commands = (AssignReview, AbandonReview)
