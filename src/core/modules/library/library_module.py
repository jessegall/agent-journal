from core.modules.library.declarations.library_dependencies import LIBRARY_DEPENDENCIES
from core.modules.library.declarations.library_handlers import LIBRARY_HANDLERS
from core.modules.library.declarations.library_subcommands import LIBRARY_SUBCOMMANDS
from core.modules.library.windows.library_windows import LIBRARY_WINDOWS
from core.modules.library.models.declarations.library_connection_model_declaration import LibraryConnectionModelDeclaration
from core.modules.library.models.declarations.library_copy_model_declaration import LibraryCopyModelDeclaration
from core.modules.library.settings.library_setting_values import LibrarySettingValues
from core.modules.library.skills.declarations.library_skills import LIBRARY_SKILLS
from engine.library.library_lookup import LibraryLookup
from core.modules.library.support.server_library_lookup import ServerLibraryLookup
from engine.module.module import Module
from core.modules.library.guards.library_address_guard import LibraryAddressGuard
from core.modules.library.migrations.m001_library import LibraryTablesMigration
from core.modules.library.migrations.m002_connection_signature_index import ConnectionSignatureIndexMigration
from core.modules.library.listeners.connection_rows_listener import ConnectionRowsListener
from core.modules.library.tick_handlers.library_sync_tick_handler import LibrarySyncTickHandler


class LibraryModule(Module):
    """Connects this journal to a team's shared server, and keeps the items a user got in step with it."""

    name = "journal.core.library"
    requires_engine = ">=6,<7"
    seed_reason = "it keeps only what a connected server gave it"
    move_reason = "version 4's team rows are not carried over"
    dependencies = LIBRARY_DEPENDENCIES
    settings = [LibrarySettingValues]
    models = [LibraryConnectionModelDeclaration, LibraryCopyModelDeclaration]
    migrations = [LibraryTablesMigration, ConnectionSignatureIndexMigration]
    listeners = [ConnectionRowsListener]
    guards = [LibraryAddressGuard]
    bindings = {LibraryLookup: ServerLibraryLookup}
    handlers = LIBRARY_HANDLERS
    subcommands = LIBRARY_SUBCOMMANDS
    tick_handlers = [LibrarySyncTickHandler]
    skills = LIBRARY_SKILLS
    windows = LIBRARY_WINDOWS
