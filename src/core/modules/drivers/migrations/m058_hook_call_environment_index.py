from engine.database.migration import Migration


class HookCallEnvironmentIndexMigration(Migration):
    """Indexes the hooks of an environment by their number, so the newest hooks of one environment are read
    without walking the hooks of every environment."""

    number = 58
    statements = ["CREATE INDEX hook_calls_environment ON hook_calls (environment_id, id)"]
