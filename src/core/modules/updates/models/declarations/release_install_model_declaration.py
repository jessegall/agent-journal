from engine.module.model_declaration import ModelDeclaration
from core.modules.updates.models.release_install import ReleaseInstall


class ReleaseInstallModelDeclaration(ModelDeclaration):
    """How the module declares ReleaseInstall."""

    model = ReleaseInstall
    excluded_subcommands = ["make", "edit", "delete"]
