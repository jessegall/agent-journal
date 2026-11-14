from engine.module.model_declaration import ModelDeclaration
from core.modules.library.models.library_connection import LibraryConnection
from core.modules.library.queries.library_connection_query import LibraryConnectionQuery
from engine.module.model_declaration import ALL_SUBCOMMANDS


class LibraryConnectionModelDeclaration(ModelDeclaration):
    """How the module declares LibraryConnection."""

    model = LibraryConnection
    query = LibraryConnectionQuery
    excluded_subcommands = ALL_SUBCOMMANDS
