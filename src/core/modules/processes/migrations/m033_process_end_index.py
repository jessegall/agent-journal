from engine.database.migration import Migration


class ProcessEndIndexMigration(Migration):
    """Lets the Finished list of the process queue read the newest ended runs without sorting them all."""

    number = 33
    statements = ["CREATE INDEX processes_environment_ended ON processes (environment_id, ended_at DESC, id DESC)"]
