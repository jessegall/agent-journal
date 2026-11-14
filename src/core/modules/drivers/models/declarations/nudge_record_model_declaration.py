from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.nudge_record import NudgeRecord


class NudgeRecordModelDeclaration(ModelDeclaration):
    """How the module declares NudgeRecord."""

    model = NudgeRecord
    excluded_subcommands = ["make", "edit", "delete"]
