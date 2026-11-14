from engine.module.model_declaration import ModelDeclaration
from core.modules.dumps.models.dump_item import DumpItem
from engine.module.model_declaration import BUILT


class DumpItemModelDeclaration(ModelDeclaration):
    """How the module declares DumpItem."""

    model = DumpItem
    excluded_subcommands = BUILT
