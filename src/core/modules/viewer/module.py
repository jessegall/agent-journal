from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_loading import WindowLoading
from core.modules.viewer.migrations.m001_viewer import ViewerTables
from core.modules.viewer.person_gives_permissions import PersonGivesPermissions
from core.modules.viewer.person_keeps_layouts import PersonKeepsLayouts
from core.modules.viewer.permission_pruner import PermissionPruner
from core.modules.viewer.viewer_layout_save_handler import ViewerLayoutSaveHandler
from core.modules.viewer.viewer_layout_save_subcommand import ViewerLayoutSaveSubcommand
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
SHELL_READS = ["environment list", "environment show", "agent list", "agent show", "setting list", "setting show", "viewer-layout list", "window permissions"]


class ViewerModule(Module):
    """Adds the viewer: the window the shell itself runs its lines as, the check of every line a window sends, each
    person's layouts and the permissions each person gives a window."""

    name = "journal.core.viewer"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.settings"]
    models = [ModelDeclaration(ViewerLayout, excluded_subcommands=["make", "edit"]), ModelDeclaration(WindowPermission, excluded_subcommands=["edit"])]
    migrations = [ViewerTables]
    handlers = [ViewerLayoutSaveHandler, WindowAllowHandler, WindowTrustHandler, WindowPermissionPruneHandler, WindowSettingSaveHandler]
    subcommands = [ViewerLayoutSaveSubcommand, WindowAllowSubcommand, WindowTrustSubcommand, WindowPermissionsSubcommand, WindowSettingSaveSubcommand,
                   WindowSettingSubcommand]
    guards = [PersonGivesPermissions, PersonKeepsLayouts]
    listeners = [PermissionPruner]
    windows = [WindowDeclaration("viewer.shell", "Viewer", "index.html", WindowLoading.PAGE, reads=SHELL_READS, runs=SHELL_RUNS)]
