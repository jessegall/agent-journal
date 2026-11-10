from engine.database.migration import Migration


class HelperJobsMigration(Migration):
    """A dispatch row becomes a helper job, with the whole brief and the message of its report; no row is closed."""

    number = 24
    statements = ["ALTER TABLE subagent_dispatches RENAME TO helper_jobs",
                  "ALTER TABLE helper_jobs RENAME COLUMN subagent_id TO helper_id",
                  "ALTER TABLE helper_jobs ADD COLUMN brief TEXT NOT NULL DEFAULT ''",
                  "ALTER TABLE helper_jobs ADD COLUMN report_message_id INTEGER"]
