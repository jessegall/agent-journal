from engine.database.migration import Migration


class ReadingPhaseTermsMigration(Migration):
    """Names when in a run a reading decision is made its phase, and the leading terms an unreadable mark covers
    its terms."""

    number = 76
    statements = ["ALTER TABLE reading_decisions RENAME COLUMN moment TO phase",
                  "ALTER TABLE unreadable_marks RENAME COLUMN words TO terms"]
