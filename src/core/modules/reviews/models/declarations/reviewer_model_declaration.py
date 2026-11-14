from engine.module.model_declaration import ModelDeclaration
from core.modules.reviews.commands.end_reviewer.end_reviewer import EndReviewer
from core.modules.reviews.commands.start_reviewer.start_reviewer import StartReviewer
from core.modules.reviews.models.reviewer import Reviewer
from core.modules.reviews.queries.reviewer_query import ReviewerQuery


class ReviewerModelDeclaration(ModelDeclaration):
    """How the module declares Reviewer."""

    model = Reviewer
    query = ReviewerQuery
    commands = (StartReviewer, EndReviewer)
    excluded_subcommands = ["make", "edit", "delete"]
