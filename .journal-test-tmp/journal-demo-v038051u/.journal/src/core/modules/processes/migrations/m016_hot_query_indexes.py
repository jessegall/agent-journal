from core.base.database.migration import Migration


class ProcessHotQueryIndexesMigration(Migration):
    """Indexes for what runs on each process save: the running runs by state, the runs of an environment, and the
    ended outputs in the order they ended."""

    number = 16
    statements = ("CREATE INDEX processes_state_id ON processes (state, id)",
                  "CREATE INDEX processes_environment_id ON processes (environment_id, id)",
                  "CREATE INDEX outputs_state_ended_at ON outputs (state, ended_at)")
