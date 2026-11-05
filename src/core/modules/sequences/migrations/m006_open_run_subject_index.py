from core.base.database.migration import Migration


class OpenRunSubjectIndexMigration(Migration):
    """Indexes the subjects of open sequence runs."""

    number = 6
    statements = ["CREATE INDEX sequence_runs_open_subject ON sequence_runs (subject_id, sequence_id) WHERE ended_at IS NULL"]
