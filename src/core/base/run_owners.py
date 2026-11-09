RUN_STOP_LINE = "output stop"


class RunOwners:
    """Whether an agent started a run, so a read-only agent may stop what it started; answered by the module that
    keeps runs, and never so without one."""

    def owns(self, agent_id: int, process_id: int) -> bool:
        return False
