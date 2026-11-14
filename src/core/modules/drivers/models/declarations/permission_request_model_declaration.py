from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.permission_request import PermissionRequest


class PermissionRequestModelDeclaration(ModelDeclaration):
    """How the module declares PermissionRequest."""

    model = PermissionRequest
    excluded_subcommands = ["make", "edit", "delete", "allow", "decline", "use"]
