from engine.database.migration import Migration


class HelperJobNewSessionMigration(Migration):
    """Adds whether a job began a new program session. A job from before this column began one when it was its
    helper's first job, which its key shows: the key of a later job holds a colon."""

    number = 55
    statements = ["ALTER TABLE helper_jobs ADD COLUMN new_session INTEGER NOT NULL DEFAULT 0",
                  "UPDATE helper_jobs SET new_session = 1 WHERE instr(tool_key, ':') = 0"]
