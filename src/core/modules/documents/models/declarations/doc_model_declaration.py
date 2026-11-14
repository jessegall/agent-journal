from engine.module.model_declaration import ModelDeclaration
from core.modules.documents.models.doc import Doc
from engine.module.model_declaration import ALL_SUBCOMMANDS


class DocModelDeclaration(ModelDeclaration):
    """How the module declares Doc."""

    model = Doc
    excluded_subcommands = ALL_SUBCOMMANDS
