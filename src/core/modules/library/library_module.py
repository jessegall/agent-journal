from core.base.module.model_declaration import ALL_SUBCOMMANDS, ModelDeclaration
from core.base.module.module import Module
from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue
from core.modules.library.commands.pair_library.pair_library_handler import PairLibraryHandler
from core.modules.library.commands.pair_library.pair_library_subcommand import PairLibrarySubcommand
from core.modules.library.commands.unpair_library.unpair_library_handler import UnpairLibraryHandler
from core.modules.library.commands.unpair_library.unpair_library_subcommand import UnpairLibrarySubcommand
from core.modules.library.commands.library_list.library_list_subcommand import LibraryListSubcommand
from core.modules.library.commands.library_show.library_show_subcommand import LibraryShowSubcommand
from core.modules.library.commands.library_versions.library_versions_subcommand import LibraryVersionsSubcommand
from core.modules.library.commands.library_status.library_status_subcommand import LibraryStatusSubcommand
from core.modules.library.commands.save_library_connection.save_library_connection_handler import SaveLibraryConnectionHandler
from core.modules.library.guards.library_address_guard import LibraryAddressGuard
from core.modules.library.migrations.m001_library import LibraryTablesMigration
from core.modules.library.models.library_connection import LibraryConnection
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.library.queries.library_connection_query import LibraryConnectionQuery


class LibraryModule(Module):
    """Connects this journal to a team's shared server, and keeps the items a person got in step with it."""

    name = "journal.core.library"
    requires_core = ">=5,<6"
    seed_reason = "it keeps only what a connected server gave it"
    move_reason = "version 4's team rows are not carried over"
    dependencies = ["journal.core.actors", "journal.core.settings"]
    settings = [SettingValue("address", "Shared server address", "The IP address or URL of your team's shared server, such as 10.0.0.5 or https://library.example.com.",
                             SettingType.TEXT, default="", scope=SettingScope.PROJECT)]
    models = [ModelDeclaration(LibraryConnection, query=LibraryConnectionQuery, excluded_subcommands=ALL_SUBCOMMANDS), ModelDeclaration(LibraryCopy, excluded_subcommands=ALL_SUBCOMMANDS)]
    migrations = [LibraryTablesMigration]
    guards = [LibraryAddressGuard]
    handlers = [PairLibraryHandler, SaveLibraryConnectionHandler, UnpairLibraryHandler]
    subcommands = [PairLibrarySubcommand, UnpairLibrarySubcommand, LibraryStatusSubcommand, LibraryListSubcommand, LibraryShowSubcommand, LibraryVersionsSubcommand]
