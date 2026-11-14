from engine.module.model_declaration import ModelDeclaration
from core.modules.updates.models.release import Release


class ReleaseModelDeclaration(ModelDeclaration):
    """How the module declares Release."""

    model = Release
    excluded_subcommands = ["make", "edit", "delete"]
