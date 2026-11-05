class GuardSwitches:
    """Whether a guard is switched on; every guard is, until a settings module binds switches of its own."""

    def enabled(self, guard_name: str) -> bool:
        return True
