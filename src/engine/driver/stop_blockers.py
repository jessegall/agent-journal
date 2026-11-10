class StopBlockers:
    """Whether an agent has work that holds its stop however often it asks; a module binds its own."""

    def is_running(self, agent_id: int) -> bool:
        return False
