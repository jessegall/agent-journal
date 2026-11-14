from engine.module.model_declaration import ModelDeclaration
from core.modules.documents.models.comment_selection import CommentSelection
from engine.module.model_declaration import ALL_SUBCOMMANDS


class CommentSelectionModelDeclaration(ModelDeclaration):
    """How the module declares CommentSelection."""

    model = CommentSelection
    excluded_subcommands = ALL_SUBCOMMANDS
