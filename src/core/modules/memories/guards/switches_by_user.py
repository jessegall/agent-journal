from core.modules.memories.guards.types_by_user import TypesByUser


class SwitchesByUser(TypesByUser):
    """A memory type's switch is made, changed and deleted only by the user, a module or the core."""

    name = "memories.switches-by-user"
    event = "memory_type_switch.*"
