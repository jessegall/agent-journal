from engine.database.migration import Migration


class MergerLineOpenQuestionIndexMigration(Migration):
    """Finds the open questions of the workers without reading the whole table: closing or cancelling a task asks
    for them, and a plan cancelled with many tasks asks once for all of them."""

    number = 70
    statements = ["CREATE INDEX merger_lines_open_questions ON merger_lines (environment_id, id) WHERE worker_id IS NOT NULL AND outcome IS NULL"]
