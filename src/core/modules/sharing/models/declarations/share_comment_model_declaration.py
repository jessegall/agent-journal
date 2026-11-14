from engine.module.model_declaration import ModelDeclaration
from core.modules.sharing.models.share_comment import ShareComment


class ShareCommentModelDeclaration(ModelDeclaration):
    """How the module declares ShareComment."""

    model = ShareComment
    excluded_subcommands = ["make", "edit", "delete"]
