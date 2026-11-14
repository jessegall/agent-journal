from engine.module.model_declaration import ModelDeclaration
from core.modules.documents.models.link import Link
from engine.module.model_declaration import ALL_SUBCOMMANDS


class LinkModelDeclaration(ModelDeclaration):
    """How the module declares Link."""

    model = Link
    excluded_subcommands = ALL_SUBCOMMANDS
