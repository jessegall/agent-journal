from core.modules.viewer.support.viewer_dependencies import VIEWER_DEPENDENCIES
from core.modules.viewer.support.viewer_migrations import VIEWER_MIGRATIONS
from core.modules.viewer.support.viewer_handlers import VIEWER_HANDLERS
from core.modules.viewer.support.viewer_subcommands import VIEWER_SUBCOMMANDS
from core.modules.viewer.models.declarations.viewer_layout_model_declaration import ViewerLayoutModelDeclaration
from core.modules.viewer.models.declarations.person_preset_model_declaration import PersonPresetModelDeclaration
from core.modules.viewer.models.declarations.window_permission_model_declaration import WindowPermissionModelDeclaration
from core.modules.viewer.windows.viewer_windows import VIEWER_WINDOWS
from engine.module.module import Module
from core.modules.viewer.guards.person_preset_owner_guard import PersonPresetOwnerGuard
from core.modules.viewer.guards.permission_owner_guard import PermissionOwnerGuard
from core.modules.viewer.guards.layout_owner_guard import LayoutOwnerGuard
from core.modules.viewer.listeners.permission_pruner_listener import PermissionPrunerListener
from core.modules.viewer.commands.support.window_setting_keys import VIEWER_SETTINGS



class ViewerModule(Module):
    """Adds the viewer: the window the shell itself runs its lines as, the check of every line a window sends,
    each user's layouts and the permissions each user gives a window."""

    name = "journal.core.viewer"
    seed_reason = "a user's layouts and presets are made by using the viewer"
    requires_engine = ">=5,<6"
    settings = VIEWER_SETTINGS
    dependencies = VIEWER_DEPENDENCIES
    models = [ViewerLayoutModelDeclaration, PersonPresetModelDeclaration, WindowPermissionModelDeclaration]
    move_reason = "each suite carries the layouts of the application it replaces"
    migrations = VIEWER_MIGRATIONS
    handlers = VIEWER_HANDLERS
    subcommands = VIEWER_SUBCOMMANDS
    guards = [PermissionOwnerGuard, LayoutOwnerGuard, PersonPresetOwnerGuard]
    listeners = [PermissionPrunerListener]
    windows = VIEWER_WINDOWS
