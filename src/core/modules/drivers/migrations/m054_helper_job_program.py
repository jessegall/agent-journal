from engine.database.migration import Migration


class HelperJobProgramMigration(Migration):
    """Adds the program that ran a job; a job from before this column has an empty one, because only the agent's
    current program was recorded."""

    number = 54
    statements = ["ALTER TABLE helper_jobs ADD COLUMN program TEXT NOT NULL DEFAULT ''"]
