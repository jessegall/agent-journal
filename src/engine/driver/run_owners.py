class RunOwners:
    """Whether an agent started a run, so a read-only agent may stop what it started; answered by the module that
    keeps runs, and never so without one."""

    def started_run(self, agent_id: int, process_id: int) -> bool:
        return False
