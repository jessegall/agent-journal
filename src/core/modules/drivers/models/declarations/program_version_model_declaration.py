from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.program_version import ProgramVersion


class ProgramVersionModelDeclaration(ModelDeclaration):
    """How the module declares ProgramEpoch."""

    model = ProgramVersion
    excluded_subcommands = ["make", "edit", "delete"]
