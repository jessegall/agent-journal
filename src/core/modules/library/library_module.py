from engine.skill.skill_declaration import SkillDeclaration
from engine.viewer.window_declaration import WindowDeclaration
from engine.viewer.window_icon import WindowIcon
from engine.viewer.window_loading import WindowLoading
from engine.viewer.window_key import WindowKey
from engine.viewer.key_loading import KeyLoading
from engine.viewer.window_place import WindowPlace
from engine.viewer.window_read_search import WindowReadSearch
from core.base.library.library_lookup import LibraryLookup
from core.modules.library.support.server_library_lookup import ServerLibraryLookup
from engine.module.model_declaration import ALL_SUBCOMMANDS, ModelDeclaration
from engine.module.module import Module
from engine.setting.setting_scope import SettingScope
from engine.setting.setting_type import SettingType
from engine.setting.setting_value import SettingValue
from core.modules.library.commands.pair_library.pair_library_handler import PairLibraryHandler
from core.modules.library.commands.pair_library.pair_library_subcommand import PairLibrarySubcommand
from core.modules.library.commands.unpair_library.unpair_library_handler import UnpairLibraryHandler
from core.modules.library.commands.unpair_library.unpair_library_subcommand import UnpairLibrarySubcommand
from core.modules.library.commands.library_list.library_list_subcommand import LibraryListSubcommand
from core.modules.library.commands.library_browse.library_browse_subcommand import LibraryBrowseSubcommand
from core.modules.library.commands.library_inspect.library_inspect_subcommand import LibraryInspectSubcommand
from core.modules.library.commands.library_show.library_show_subcommand import LibraryShowSubcommand
from core.modules.library.commands.library_versions.library_versions_subcommand import LibraryVersionsSubcommand
from core.modules.library.commands.library_status.library_status_subcommand import LibraryStatusSubcommand
from core.modules.library.commands.remove_library_item.remove_library_item_handler import RemoveLibraryItemHandler
from core.modules.library.commands.remove_library_item.remove_library_item_subcommand import RemoveLibraryItemSubcommand
from core.modules.library.commands.restore_library_item.restore_library_item_handler import RestoreLibraryItemHandler
from core.modules.library.commands.restore_library_item.restore_library_item_subcommand import RestoreLibraryItemSubcommand
from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from core.modules.library.commands.delete_library_copy.delete_library_copy_handler import DeleteLibraryCopyHandler
from core.modules.library.commands.update_library_connection.update_library_connection_handler import UpdateLibraryConnectionHandler
from core.modules.library.commands.update_library_copy.update_library_copy_handler import UpdateLibraryCopyHandler
from core.modules.library.commands.choose_library_version.choose_library_version_handler import ChooseLibraryVersionHandler
from core.modules.library.commands.choose_library_version.choose_library_version_subcommand import ChooseLibraryVersionSubcommand
from core.modules.library.commands.run_library_sync.run_library_sync_handler import RunLibrarySyncHandler
from core.modules.library.commands.run_library_sync.run_library_sync_subcommand import RunLibrarySyncSubcommand
from core.modules.library.commands.merge_library_item.merge_library_item_handler import MergeLibraryItemHandler
from core.modules.library.ticks.library_sync_tick import LibrarySyncTick
from core.modules.library.commands.add_library_user.add_library_user_handler import AddLibraryUserHandler
from core.modules.library.commands.add_library_user.add_library_user_subcommand import AddLibraryUserSubcommand
from core.modules.library.commands.set_library_role.set_library_role_handler import SetLibraryRoleHandler
from core.modules.library.commands.set_library_role.set_library_role_subcommand import SetLibraryRoleSubcommand
from core.modules.library.commands.remove_library_user.remove_library_user_handler import RemoveLibraryUserHandler
from core.modules.library.commands.remove_library_user.remove_library_user_subcommand import RemoveLibraryUserSubcommand
from core.modules.library.commands.revoke_library_token.revoke_library_token_handler import RevokeLibraryTokenHandler
from core.modules.library.commands.revoke_library_token.revoke_library_token_subcommand import RevokeLibraryTokenSubcommand
from core.modules.library.commands.library_user_list.library_user_list_subcommand import LibraryUserListSubcommand
from core.modules.library.commands.library_user_tokens.library_user_tokens_subcommand import LibraryUserTokensSubcommand
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
from core.modules.library.migrations.m002_connection_signature_index import ConnectionSignatureIndexMigration
from core.modules.library.listeners.connection_rows_listener import ConnectionRowsListener
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
    dependencies = ["journal.core.actors", "journal.core.settings", "journal.core.documents", "journal.core.secrets", "journal.core.agents"]
    settings = [SettingValue("address", "Shared server address", "The IP address or URL of your team's shared server, such as 10.0.0.5 or https://library.example.com.",
                             SettingType.TEXT, default="", scope=SettingScope.PROJECT),
                SettingValue("agent-edits-wait", "Agent edits wait for a person", "An agent's edit of an item that follows the library stays on this journal until a person sends it.",
                             SettingType.FLAG, default=True, scope=SettingScope.PROJECT)]
    models = [ModelDeclaration(LibraryConnection, query=LibraryConnectionQuery, excluded_subcommands=ALL_SUBCOMMANDS), ModelDeclaration(LibraryCopy, excluded_subcommands=ALL_SUBCOMMANDS)]
    migrations = [LibraryTablesMigration, ConnectionSignatureIndexMigration]
    listeners = [ConnectionRowsListener]
    guards = [LibraryAddressGuard]
    bindings = {LibraryLookup: ServerLibraryLookup}
    handlers = [PairLibraryHandler, SaveLibraryConnectionHandler, UnpairLibraryHandler, SaveLibraryCopyHandler, MakeLibraryCopyHandler, LeaveLibraryCopyHandler, AddLibraryUserHandler, SetLibraryRoleHandler, RemoveLibraryUserHandler, RevokeLibraryTokenHandler, SendLibraryItemHandler,
                RunLibrarySyncHandler, ChooseLibraryVersionHandler, MergeLibraryItemHandler, UpdateLibraryCopyHandler, DeleteLibraryCopyHandler, UpdateLibraryConnectionHandler, RemoveLibraryItemHandler,
                RestoreLibraryItemHandler]
    subcommands = [PairLibrarySubcommand, UnpairLibrarySubcommand, LibraryStatusSubcommand, LibraryListSubcommand, LibraryBrowseSubcommand, LibraryInspectSubcommand, LibraryShowSubcommand, LibraryVersionsSubcommand, LibraryUserListSubcommand, LibraryUserTokensSubcommand, AddLibraryUserSubcommand, SetLibraryRoleSubcommand, RemoveLibraryUserSubcommand,
                   RevokeLibraryTokenSubcommand,
                   MakeLibraryCopySubcommand, SendLibraryItemSubcommand, LeaveLibraryCopySubcommand, LibraryCopiesSubcommand, RunLibrarySyncSubcommand, ChooseLibraryVersionSubcommand, RemoveLibraryItemSubcommand, RestoreLibraryItemSubcommand]
    tick_handlers = [TickHandler(TickInterval(seconds=10), LibrarySyncTick(), "library sync")]
    skills = [SkillDeclaration("journal-library", "Use the library to find, read, get and share a team's documents, sequences and checks; read it when a shared item is needed",
                               keywords=("library", "team", "shared"), commands=["library"])]
    windows = [WindowDeclaration("library.teams", "Teams", "teams.js", WindowLoading.COMPONENT, skeleton=LIBRARY_TEAMS_SKELETON, search=WindowReadSearch("library list", "Search the library", ("title", "abstract")),
                                 place=WindowPlace.PAGE, group="project", icon=WindowIcon.SHARE, reads=["library status", "library list", "library browse", "library inspect", "library show", "library copies", "library-user list", "library-user tokens"],
                                 keys=[WindowKey("status", "library status", events=["library_connection.*"]),
                                       WindowKey("copies", "library copies", events=["library_copy.*"], reload_seconds=30),
                                       WindowKey("users", "library-user list", loading=KeyLoading.REQUESTED),
                                       WindowKey("tokens", "library-user tokens {user}", loading=KeyLoading.REQUESTED),
                                       WindowKey("item", "library show {share} {id}", loading=KeyLoading.REQUESTED),
                                       WindowKey("inspection", "library inspect {share} {id}", loading=KeyLoading.REQUESTED),
                                       WindowKey("listing", "library browse", arguments=["type", "search"], loading=KeyLoading.REQUESTED)],
                                 runs=["library connect", "library get", "library share", "library sync", "library resolve", "library leave", "library remove", "library restore", "library-user add", "library-user role", "library-user remove", "library-user revoke"], events=["library_connection.*", "library_copy.*"])]
