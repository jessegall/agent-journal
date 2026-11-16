from engine.database.migration import Migration


class StackedStateJobReportKeyMigration(Migration):
    """A reason kept on an agent's stack names the work a stop hands in job_report, as the reason's field does."""

    number = 83
    statements = ["UPDATE agent_stacks SET stacked_states = replace(stacked_states, '\"handover\":', '\"job_report\":')"
                  " WHERE stacked_states LIKE '%\"handover\":%'"]
