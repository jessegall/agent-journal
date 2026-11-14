from engine.module.model_declaration import ModelDeclaration
from core.modules.reviews.models.review_step import ReviewStep


class ReviewStepModelDeclaration(ModelDeclaration):
    """How the module declares ReviewStep."""

    model = ReviewStep
    excluded_subcommands = ["make", "edit", "delete"]
