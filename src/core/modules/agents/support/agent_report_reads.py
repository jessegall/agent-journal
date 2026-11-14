class AgentReportReads:
    """The last report an agent filed, which a new session of the agent can read; answered by the module that
    keeps reports, and none without one."""

    def newest_report_id(self, agent_id: int) -> int | None:
        return None
