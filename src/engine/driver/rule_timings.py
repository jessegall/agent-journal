RULES_KEPT = 200


class RuleTimings:
    """How long each rule took on the hooks of each agent, the latest of them, so the slowest can be named; it
    lives as long as the server."""

    def __init__(self) -> None:
        self.seconds: dict[int, list[tuple[str, float]]] = {}

    def note(self, agent_id: int, rule: str, seconds: float) -> None:
        self.seconds[agent_id] = [*self.seconds.get(agent_id, [])[-(RULES_KEPT - 1):], (rule, seconds)]

    def slowest(self, agent_id: int) -> str:
        timed = self.seconds.get(agent_id, [])
        return max(timed, key=lambda note: note[1])[0] if timed else ""
