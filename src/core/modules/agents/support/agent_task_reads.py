class AgentTaskReads:
    """The tasks an agent still has open, which a new session of the agent goes on with; answered by the module
    that keeps tasks, and none without one."""

    def open_task_ids(self, agent_id: int) -> tuple[int, ...]:
        return ()
