from engine.database.migration import Migration


class AgentMachineListIndexesMigration(Migration):
    """Lists the agent machine's rows of an environment or an agent by index, newest first, and finds the
    comparisons of one difference, as their list commands ask."""

    number = 72
    statements = ["CREATE INDEX agent_escalations_environment_agent ON agent_escalations (environment_id, session_agent_id)",
                  "CREATE INDEX agent_frame_suppressions_agent ON agent_frame_suppressions (session_agent_id)",
                  "CREATE INDEX agent_step_requests_agent ON agent_step_requests (session_agent_id)",
                  "CREATE INDEX agent_wakes_environment ON agent_wakes (environment_id)",
                  "CREATE INDEX driver_comparisons_difference ON driver_comparisons (difference_state, difference_key)",
                  "CREATE INDEX driver_grants_environment ON driver_grants (environment_id)"]
