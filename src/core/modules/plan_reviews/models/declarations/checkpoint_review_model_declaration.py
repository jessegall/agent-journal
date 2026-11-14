from engine.module.model_declaration import ModelDeclaration
from core.modules.plan_reviews.models.checkpoint_review import CheckpointReview


class CheckpointReviewModelDeclaration(ModelDeclaration):
    """How the module declares CheckpointReview."""

    model = CheckpointReview
    excluded_subcommands = ["make", "edit", "delete"]
