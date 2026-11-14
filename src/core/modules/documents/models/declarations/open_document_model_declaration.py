from engine.module.model_declaration import ModelDeclaration
from core.modules.documents.models.open_document import OpenDocument
from engine.module.model_declaration import ALL_SUBCOMMANDS


class OpenDocumentModelDeclaration(ModelDeclaration):
    """How the module declares OpenDocument."""

    model = OpenDocument
    excluded_subcommands = ALL_SUBCOMMANDS
