from core.modules.viewer.models.declarations.viewer_layout_model_declaration import ViewerLayoutModelDeclaration
from core.modules.viewer.models.declarations.person_preset_model_declaration import PersonPresetModelDeclaration
from core.modules.viewer.models.declarations.window_permission_model_declaration import WindowPermissionModelDeclaration
from core.modules.viewer.windows.viewer_windows import VIEWER_WINDOWS
from core.modules.viewer.migrations.m003_helpers_window_key import HelpersWindowKeyMigration
from core.modules.viewer.migrations.m004_person_row_indexes import PersonRowIndexesMigration
from engine.module.module import Module
from core.modules.viewer.migrations.m001_viewer import ViewerTablesMigration
from core.modules.viewer.migrations.m002_person_presets import PersonPresetsMigration
from core.modules.viewer.commands.person_preset_list.person_preset_list_subcommand import PersonPresetListSubcommand
from core.modules.viewer.commands.remove_person_preset.remove_person_preset_handler import RemovePersonPresetHandler
from core.modules.viewer.commands.remove_person_preset.remove_person_preset_subcommand import RemovePersonPresetSubcommand
from core.modules.viewer.commands.rename_person_preset.rename_person_preset_handler import RenamePersonPresetHandler
from core.modules.viewer.commands.rename_person_preset.rename_person_preset_subcommand import RenamePersonPresetSubcommand
from core.modules.viewer.commands.save_person_preset.save_person_preset_handler import SavePersonPresetHandler
from core.modules.viewer.commands.save_person_preset.save_person_preset_subcommand import SavePersonPresetSubcommand
from core.modules.viewer.guards.person_preset_owner_guard import PersonPresetOwnerGuard
from core.modules.viewer.guards.permission_owner_guard import PermissionOwnerGuard
from core.modules.viewer.guards.layout_owner_guard import LayoutOwnerGuard
from core.modules.viewer.listeners.permission_pruner_listener import PermissionPrunerListener
from core.modules.viewer.commands.save_viewer_layout.save_viewer_layout_handler import SaveViewerLayoutHandler
from core.modules.viewer.commands.save_viewer_layout.save_viewer_layout_subcommand import SaveViewerLayoutSubcommand
from core.modules.viewer.commands.viewer_layout_current.viewer_layout_current_subcommand import ViewerLayoutCurrentSubcommand
from core.modules.viewer.commands.allow_window.allow_window_handler import AllowWindowHandler
from core.modules.viewer.commands.save_window_setting.save_window_setting_handler import SaveWindowSettingHandler
from core.modules.viewer.commands.save_window_setting.save_window_setting_subcommand import SaveWindowSettingSubcommand
from core.modules.viewer.commands.allow_window.allow_window_subcommand import AllowWindowSubcommand
from core.modules.viewer.commands.prune_window_permissions.prune_window_permissions_handler import PruneWindowPermissionsHandler
from core.modules.viewer.commands.window_permissions.window_permissions_subcommand import WindowPermissionsSubcommand
from core.modules.viewer.commands.window_search.window_search_subcommand import WindowSearchSubcommand
from core.modules.viewer.commands.window_setting.window_setting_subcommand import WindowSettingSubcommand
from core.modules.viewer.commands.trust_window.trust_window_handler import TrustWindowHandler
from core.modules.viewer.commands.trust_window.trust_window_subcommand import TrustWindowSubcommand
from core.modules.viewer.commands.support.window_setting_keys import VIEWER_SETTINGS



class ViewerModule(Module):
    """Adds the viewer: the window the shell itself runs its lines as, the check of every line a window sends,
    each user's layouts and the permissions each user gives a window."""

    name = "journal.core.viewer"
    seed_reason = "a user's layouts and presets are made by using the viewer"
    requires_engine = ">=5,<6"
    settings = VIEWER_SETTINGS
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.settings", "journal.core.drivers"]
    models = [ViewerLayoutModelDeclaration, PersonPresetModelDeclaration, WindowPermissionModelDeclaration]
    move_reason = "each suite carries the layouts of the application it replaces"
    migrations = [ViewerTablesMigration, PersonPresetsMigration, HelpersWindowKeyMigration, PersonRowIndexesMigration]
    handlers = [SaveViewerLayoutHandler, SavePersonPresetHandler, RenamePersonPresetHandler, RemovePersonPresetHandler, AllowWindowHandler, TrustWindowHandler, PruneWindowPermissionsHandler, SaveWindowSettingHandler]
    subcommands = [SaveViewerLayoutSubcommand, SavePersonPresetSubcommand, RenamePersonPresetSubcommand, RemovePersonPresetSubcommand, PersonPresetListSubcommand, ViewerLayoutCurrentSubcommand, AllowWindowSubcommand, TrustWindowSubcommand, WindowPermissionsSubcommand,
                   SaveWindowSettingSubcommand, WindowSettingSubcommand, WindowSearchSubcommand]
    guards = [PermissionOwnerGuard, LayoutOwnerGuard, PersonPresetOwnerGuard]
    listeners = [PermissionPrunerListener]
    windows = VIEWER_WINDOWS
