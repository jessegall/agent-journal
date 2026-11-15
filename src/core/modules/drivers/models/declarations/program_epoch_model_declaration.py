from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.program_epoch import ProgramEpoch


class ProgramEpochModelDeclaration(ModelDeclaration):
    """How the module declares ProgramEpoch."""

    model = ProgramEpoch
    excluded_subcommands = ["make", "edit", "delete"]
