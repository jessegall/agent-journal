from engine.module.model_declaration import ModelDeclaration
from core.modules.viewer.models.window_permission import WindowPermission


class WindowPermissionModelDeclaration(ModelDeclaration):
    """How the module declares WindowPermission."""

    model = WindowPermission
    excluded_subcommands = ["edit"]
