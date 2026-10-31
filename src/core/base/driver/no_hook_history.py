class NoHookHistory:
    """The history the core binds until the drivers module keeps one: no rule ever regains control."""

    def regained_control(self, agent_id: int, rule: str, layer: str) -> bool:
        return False
