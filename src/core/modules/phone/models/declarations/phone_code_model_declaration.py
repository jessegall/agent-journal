from engine.module.model_declaration import ModelDeclaration
from core.modules.phone.models.phone_code import PhoneCode


class PhoneCodeModelDeclaration(ModelDeclaration):
    """How the module declares PhoneCode."""

    model = PhoneCode
    excluded_subcommands = ["make", "list", "show", "edit", "delete"]
