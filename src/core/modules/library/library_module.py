from core.base.module.model_declaration import ALL_SUBCOMMANDS, ModelDeclaration
from core.base.module.module import Module
from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue
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
