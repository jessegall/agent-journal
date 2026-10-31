from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_loading import WindowLoading
from core.modules.viewer.migrations.m001_viewer import ViewerTablesMigration
from core.modules.viewer.permission_owner_guard import PermissionOwnerGuard
from core.modules.viewer.layout_owner_guard import LayoutOwnerGuard
from core.modules.viewer.permission_pruner_listener import PermissionPrunerListener
from core.modules.viewer.viewer_layout_save_handler import ViewerLayoutSaveHandler
from core.modules.viewer.viewer_layout_save_subcommand import ViewerLayoutSaveSubcommand
from core.modules.viewer.viewer_layout_current_subcommand import ViewerLayoutCurrentSubcommand
from core.modules.viewer.window_allow_handler import WindowAllowHandler
from core.modules.viewer.window_setting_save_handler import WindowSettingSaveHandler
from core.modules.viewer.window_setting_save_subcommand import WindowSettingSaveSubcommand
from core.modules.viewer.window_allow_subcommand import WindowAllowSubcommand
from core.modules.viewer.window_permission_prune_handler import WindowPermissionPruneHandler
from core.modules.viewer.window_permissions_subcommand import WindowPermissionsSubcommand
from core.modules.viewer.window_setting_subcommand import WindowSettingSubcommand
from core.modules.viewer.window_trust_handler import WindowTrustHandler
from core.modules.viewer.window_trust_subcommand import WindowTrustSubcommand
from core.modules.viewer.viewer_layout import ViewerLayout
from core.modules.viewer.window_permission import WindowPermission

SHELL_RUNS = ["setting make", "viewer-layout save", "window allow"]
SHELL_READS = ["environment list", "environment show", "agent list", "agent show", "setting list", "setting show", "viewer-layout current",
               "window permissions", "suite current", "suite layout"]


class ViewerModule(Module):
    """Adds the viewer: the window the shell itself runs its lines as, the check of every line a window sends, each
    person's layouts and the permissions each person gives a window."""

    name = "journal.core.viewer"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.settings", "journal.core.drivers"]
    models = [ModelDeclaration(ViewerLayout, excluded_subcommands=["make", "edit"]), ModelDeclaration(WindowPermission, excluded_subcommands=["edit"])]
    migrations = [ViewerTablesMigration]
    handlers = [ViewerLayoutSaveHandler, WindowAllowHandler, WindowTrustHandler, WindowPermissionPruneHandler, WindowSettingSaveHandler]
    subcommands = [ViewerLayoutSaveSubcommand, ViewerLayoutCurrentSubcommand, WindowAllowSubcommand, WindowTrustSubcommand, WindowPermissionsSubcommand,
                   WindowSettingSaveSubcommand, WindowSettingSubcommand]
    guards = [PermissionOwnerGuard, LayoutOwnerGuard]
    listeners = [PermissionPrunerListener]
    windows = [WindowDeclaration("viewer.shell", "Viewer", "index.html", WindowLoading.COMPONENT, reads=SHELL_READS, runs=SHELL_RUNS)]
