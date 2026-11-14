from engine.database.migration import Migration


class AllEnvironmentsPlanStateIndexMigration(Migration):
    """Indexes plans in each state, for reads across all environments."""

    number = 6
    statements = ["CREATE INDEX plans_state ON plans (state, id)"]
