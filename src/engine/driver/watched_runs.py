class WatchedRuns:
    """Whether an agent is waiting on a run it watches, so its stop is a wait and no end of its
    work; a module binds its own."""

    def is_watching(self, agent_id: int) -> bool:
        return False
