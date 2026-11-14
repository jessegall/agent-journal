from engine.database.migration import Migration


class MergerLineOpenQuestionIndexAnyScopeMigration(Migration):
    """Finds the open questions of the workers by an index on the open ones alone, so a read with no environment,
    as the demo seed makes, uses it too."""

    number = 71
    statements = ["DROP INDEX IF EXISTS merger_lines_open_questions",
                  "CREATE INDEX merger_lines_open_questions ON merger_lines (id) WHERE worker_id IS NOT NULL AND outcome IS NULL"]
