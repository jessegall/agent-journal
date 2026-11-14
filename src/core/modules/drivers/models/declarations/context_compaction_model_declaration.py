from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.context_compaction import ContextCompaction


class ContextCompactionModelDeclaration(ModelDeclaration):
    """How the module declares ContextCompaction."""

    model = ContextCompaction
    excluded_subcommands = ["make", "edit", "delete"]
