from engine.process.door.placed_run import PlacedRun


class RunPauses:
    """Says whether the agent a run works for is paused. With no processes module installed no run has an agent, so
    none is paused; the processes module binds the pauses of the agents."""

    def is_paused(self, run: PlacedRun) -> bool:
        return False
