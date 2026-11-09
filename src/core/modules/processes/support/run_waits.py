class RunWaits:
    """How many seconds an agent's queued test or build holds its call, in one window over the queue and the run;
    None keeps the ordinary limits. The core waits for nobody; a module binds its own."""

    def seconds(self, agent_id: int) -> int | None:
        return None
