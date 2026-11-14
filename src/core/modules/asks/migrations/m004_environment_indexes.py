from engine.database.migration import Migration


class AsksEnvironmentIndexesMigration(Migration):
    """Indexes asks, their steps and the ask stacks by environment, so the list of one environment reads no
    other row."""

    number = 4
    statements = [
        "CREATE INDEX asks_environment ON asks (environment_id, id)",
        "CREATE INDEX ask_steps_environment ON ask_steps (environment_id, id)",
        "CREATE INDEX ask_stacks_environment ON ask_stacks (environment_id, id)",
    ]
