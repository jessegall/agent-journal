from engine.module.model_declaration import ModelDeclaration
from core.modules.developer.models.private_data_mark import PrivateDataMark


class PrivateDataMarkModelDeclaration(ModelDeclaration):
    """How the module declares PrivateDataMark."""

    model = PrivateDataMark
    excluded_subcommands = ["make", "edit", "delete"]
