from engine.module.model_declaration import ModelDeclaration
from core.modules.dumps.models.dump import Dump
from engine.module.model_declaration import BUILT


class DumpModelDeclaration(ModelDeclaration):
    """How the module declares Dump."""

    model = Dump
    excluded_subcommands = BUILT
