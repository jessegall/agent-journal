from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.helper_job import HelperJob


class HelperJobModelDeclaration(ModelDeclaration):
    """How the module declares HelperJob."""

    model = HelperJob
    excluded_subcommands = ["make", "edit", "delete"]
