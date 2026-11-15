from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.used_grant_record import UsedGrantRecord


class UsedGrantRecordModelDeclaration(ModelDeclaration):
    """How the module declares UsedGrantRecord."""

    model = UsedGrantRecord
    excluded_subcommands = ["make", "edit", "delete"]
