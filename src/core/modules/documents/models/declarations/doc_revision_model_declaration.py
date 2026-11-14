from engine.module.model_declaration import ModelDeclaration
from core.modules.documents.models.doc_revision import DocRevision
from engine.module.model_declaration import ALL_SUBCOMMANDS


class DocRevisionModelDeclaration(ModelDeclaration):
    """How the module declares DocRevision."""

    model = DocRevision
    excluded_subcommands = ALL_SUBCOMMANDS
