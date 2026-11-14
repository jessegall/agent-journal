from engine.module.model_declaration import ModelDeclaration
from core.modules.library.models.library_copy import LibraryCopy
from engine.module.model_declaration import ALL_SUBCOMMANDS


class LibraryCopyModelDeclaration(ModelDeclaration):
    """How the module declares LibraryCopy."""

    model = LibraryCopy
    excluded_subcommands = ALL_SUBCOMMANDS
