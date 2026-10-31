from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.modules.viewer.migrations.m001_viewer import ViewerTablesMigration
from core.modules.viewer.migrations.m002_person_presets import PersonPresetsMigration
from core.modules.viewer.commands.person_preset_list_subcommand import PersonPresetListSubcommand
from core.modules.viewer.commands.remove_person_preset_handler import RemovePersonPresetHandler
from core.modules.viewer.commands.remove_person_preset_subcommand import RemovePersonPresetSubcommand
from core.modules.viewer.commands.rename_person_preset_handler import RenamePersonPresetHandler
from core.modules.viewer.commands.rename_person_preset_subcommand import RenamePersonPresetSubcommand
from core.modules.viewer.commands.save_person_preset_handler import SavePersonPresetHandler
from core.modules.viewer.commands.save_person_preset_subcommand import SavePersonPresetSubcommand
from core.modules.viewer.guards.person_preset_owner_guard import PersonPresetOwnerGuard
from core.modules.viewer.models.person_preset import PersonPreset
from core.modules.viewer.guards.permission_owner_guard import PermissionOwnerGuard
from core.modules.viewer.guards.layout_owner_guard import LayoutOwnerGuard
from core.modules.viewer.listeners.permission_pruner_listener import PermissionPrunerListener
from core.modules.viewer.commands.save_viewer_layout_handler import SaveViewerLayoutHandler
from core.modules.viewer.commands.save_viewer_layout_subcommand import SaveViewerLayoutSubcommand
from core.modules.viewer.commands.viewer_layout_current_subcommand import ViewerLayoutCurrentSubcommand
from core.modules.viewer.commands.allow_window_handler import AllowWindowHandler
from core.modules.viewer.commands.save_window_setting_handler import SaveWindowSettingHandler
from core.modules.viewer.commands.save_window_setting_subcommand import SaveWindowSettingSubcommand
from core.modules.viewer.commands.allow_window_subcommand import AllowWindowSubcommand
from core.modules.viewer.commands.prune_window_permissions_handler import PruneWindowPermissionsHandler
from core.modules.viewer.commands.window_permissions_subcommand import WindowPermissionsSubcommand
from core.modules.viewer.commands.window_setting_subcommand import WindowSettingSubcommand
from core.modules.viewer.commands.trust_window_handler import TrustWindowHandler
from core.modules.viewer.commands.trust_window_subcommand import TrustWindowSubcommand
from core.modules.viewer.models.viewer_layout import ViewerLayout
from core.modules.viewer.models.window_permission import WindowPermission
from core.modules.viewer.commands.support.window_setting_keys import VIEWER_SETTINGS

SHELL_RUNS = ["setting make", "viewer-layout save", "window allow"]
SHELL_READS = ["environment list", "environment show", "agent list", "agent show", "setting list", "setting show", "viewer-layout current",
               "window permissions", "suite current", "suite layout"]


class ViewerModule(Module):
    """Adds the viewer: the window the shell itself runs its lines as, the check of every line a window sends, each
    person's layouts and the permissions each person gives a window."""

    name = "journal.core.viewer"
    requires_core = ">=5,<6"
    settings = VIEWER_SETTINGS
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.settings", "journal.core.drivers"]
    models = [ModelDeclaration(ViewerLayout, excluded_subcommands=["make", "edit"]), ModelDeclaration(PersonPreset, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(WindowPermission, excluded_subcommands=["edit"])]
    migrations = [ViewerTablesMigration, PersonPresetsMigration]
    handlers = [SaveViewerLayoutHandler, SavePersonPresetHandler, RenamePersonPresetHandler, RemovePersonPresetHandler, AllowWindowHandler, TrustWindowHandler, PruneWindowPermissionsHandler, SaveWindowSettingHandler]
    subcommands = [SaveViewerLayoutSubcommand, SavePersonPresetSubcommand, RenamePersonPresetSubcommand, RemovePersonPresetSubcommand, PersonPresetListSubcommand, ViewerLayoutCurrentSubcommand, AllowWindowSubcommand, TrustWindowSubcommand, WindowPermissionsSubcommand,
                   SaveWindowSettingSubcommand, WindowSettingSubcommand]
    guards = [PermissionOwnerGuard, LayoutOwnerGuard, PersonPresetOwnerGuard]
    listeners = [PermissionPrunerListener]
    windows = [WindowDeclaration("viewer.shell", "Viewer", "index.html", WindowLoading.COMPONENT, icon=WindowIcon.WINDOW, reads=SHELL_READS, runs=SHELL_RUNS)]
