from core.modules.memories.guards.type_change_guard import TypeChangeGuard


class SwitchChangeGuard(TypeChangeGuard):
    """A memory type's switch is made, changed and deleted only by the user, a module or the core."""

    name = "memories.switch-changes"
    event = "memory_type_switch.*"
