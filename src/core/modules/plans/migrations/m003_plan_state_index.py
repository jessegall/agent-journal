from engine.database.migration import Migration


class PlanStateIndexMigration(Migration):
    """A state's plans are paged newest first through an index, closed ones too, which the open-plans index
    leaves out."""

    number = 3
    statements = tuple(["CREATE INDEX plans_environment_state ON plans (environment_id, state, id)"])
