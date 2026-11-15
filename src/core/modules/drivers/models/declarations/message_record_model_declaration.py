from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.message_record import MessageRecord


class MessageRecordModelDeclaration(ModelDeclaration):
    """How the module declares NudgeRecord."""

    model = MessageRecord
    excluded_subcommands = ["make", "edit", "delete"]
