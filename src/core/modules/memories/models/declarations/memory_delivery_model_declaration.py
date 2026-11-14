from engine.module.model_declaration import ModelDeclaration
from core.modules.memories.models.memory_delivery import MemoryDelivery


class MemoryDeliveryModelDeclaration(ModelDeclaration):
    """How the module declares MemoryDelivery."""

    model = MemoryDelivery
    excluded_subcommands = ["make", "edit", "delete"]
