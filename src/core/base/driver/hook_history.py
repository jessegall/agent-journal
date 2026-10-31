from core.base.timestamp import Timestamp


class HookHistory:
    """What the journal remembers of a rule for an agent and layer: whether it has control again, an overlay having
    silenced it the last time it was due, and when it last spoke. With no module keeping a history, no rule ever
    regains control or has spoken."""

    def regained_control(self, agent_id: int, rule: str, layer: str) -> bool:
        return False

    def last_spoke_at(self, agent_id: int, rule: str, layer: str) -> Timestamp | None:
        return None

