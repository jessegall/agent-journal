from engine.module.model_declaration import ModelDeclaration
from core.modules.phone.commands.unpair_phone.unpair_phone import UnpairPhone
from core.modules.phone.models.phone import Phone


class PhoneModelDeclaration(ModelDeclaration):
    """How the module declares Phone."""

    model = Phone
    commands = [UnpairPhone]
    excluded_subcommands = ["make", "edit"]
