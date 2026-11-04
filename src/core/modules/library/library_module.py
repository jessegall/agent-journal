from core.base.skill.skill_declaration import SkillDeclaration
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from core.base.viewer.window_read_search import WindowReadSearch
from core.base.library.library_lookup import LibraryLookup
from core.modules.library.support.server_library_lookup import ServerLibraryLookup
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
from core.modules.library.commands.remove_library_item.remove_library_item_handler import RemoveLibraryItemHandler
from core.modules.library.commands.remove_library_item.remove_library_item_subcommand import RemoveLibraryItemSubcommand
from core.modules.library.commands.restore_library_item.restore_library_item_handler import RestoreLibraryItemHandler
from core.modules.library.commands.restore_library_item.restore_library_item_subcommand import RestoreLibraryItemSubcommand
from core.modules.library.commands.leave_library_copy.leave_library_copy_handler import LeaveLibraryCopyHandler
from core.modules.library.commands.leave_library_copy.leave_library_copy_subcommand import LeaveLibraryCopySubcommand
from core.modules.library.commands.library_copies.library_copies_subcommand import LibraryCopiesSubcommand
from core.modules.library.commands.make_library_copy.make_library_copy_handler import MakeLibraryCopyHandler
from core.modules.library.commands.make_library_copy.make_library_copy_subcommand import MakeLibraryCopySubcommand
from core.modules.library.commands.save_library_copy.save_library_copy_handler import SaveLibraryCopyHandler
from core.modules.library.commands.send_library_item.send_library_item_handler import SendLibraryItemHandler
from core.modules.library.commands.send_library_item.send_library_item_subcommand import SendLibraryItemSubcommand
from core.modules.library.commands.save_library_connection.save_library_connection_handler import SaveLibraryConnectionHandler
from core.modules.library.guards.library_address_guard import LibraryAddressGuard
from core.modules.library.migrations.m001_library import LibraryTablesMigration
from core.modules.library.models.library_connection import LibraryConnection
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.library.queries.library_connection_query import LibraryConnectionQuery
from core.modules.library.support.skeletons import LIBRARY_TEAMS_SKELETON


class LibraryModule(Module):
    """Connects this journal to a team's shared server, and keeps the items a person got in step with it."""

    name = "journal.core.library"
    requires_core = ">=5,<6"
    seed_reason = "it keeps only what a connected server gave it"
    move_reason = "version 4's team rows are not carried over"
    dependencies = ["journal.core.actors", "journal.core.settings", "journal.core.documents", "journal.core.secrets"]
    settings = [SettingValue("address", "Shared server address", "The IP address or URL of your team's shared server, such as 10.0.0.5 or https://library.example.com.",
                             SettingType.TEXT, default="", scope=SettingScope.PROJECT)]
    models = [ModelDeclaration(LibraryConnection, query=LibraryConnectionQuery, excluded_subcommands=ALL_SUBCOMMANDS), ModelDeclaration(LibraryCopy, excluded_subcommands=ALL_SUBCOMMANDS)]
    migrations = [LibraryTablesMigration]
    guards = [LibraryAddressGuard]
    bindings = {LibraryLookup: ServerLibraryLookup}
    handlers = [PairLibraryHandler, SaveLibraryConnectionHandler, UnpairLibraryHandler, SaveLibraryCopyHandler, MakeLibraryCopyHandler, LeaveLibraryCopyHandler, SendLibraryItemHandler, RemoveLibraryItemHandler,
                RestoreLibraryItemHandler]
    subcommands = [PairLibrarySubcommand, UnpairLibrarySubcommand, LibraryStatusSubcommand, LibraryListSubcommand, LibraryShowSubcommand, LibraryVersionsSubcommand,
                   MakeLibraryCopySubcommand, SendLibraryItemSubcommand, LeaveLibraryCopySubcommand, LibraryCopiesSubcommand, RemoveLibraryItemSubcommand, RestoreLibraryItemSubcommand]
    skills = [SkillDeclaration("journal-library", "Find, read, get and share a team's documents, sequences and checks; read it when a shared item is needed",
                               keywords=("library", "team", "shared"), commands=["library"])]
    windows = [WindowDeclaration("library.teams", "Teams", "teams.js", WindowLoading.COMPONENT, skeleton=LIBRARY_TEAMS_SKELETON, search=WindowReadSearch("library list", "Search the library", ("title", "abstract")),
                                 place=WindowPlace.PAGE, group="project", icon=WindowIcon.SHARE, reads=["library status", "library list", "library show", "library versions", "library copies"],
                                 runs=["library connect", "library get", "library share", "library leave", "library remove", "library restore"], events=["library_connection.*", "library_copy.*"])]
