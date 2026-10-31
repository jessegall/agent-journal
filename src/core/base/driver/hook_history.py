class HookHistory:
    """Whether a history rule has control again for a layer: an overlay silenced it the last time it was due. With no
    module keeping a history, no rule ever regains control."""

    def regained_control(self, agent_id: int, rule: str, layer: str) -> bool:
        return False
