from core.base.database.migration import Migration


class ProcessQueueIndexesMigration(Migration):
    """Lets the process queue page read the runs still going, and the last queue runs that ended, through their own
    few rows instead of every process of the environment."""

    number = 26
    statements = ["CREATE INDEX processes_open_id ON processes (environment_id, id) WHERE ended_at IS NULL",
                  "CREATE INDEX processes_queue_ended ON processes (environment_id, ended_at, id) WHERE is_queue_run = 1"]
