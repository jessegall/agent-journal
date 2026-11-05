SEQUENCE_RUN_ROWS_SELECT = (
    "SELECT sequence_runs.id, sequence_runs.environment_id, sequence_runs.session_agent_id, sequence_runs.sequence_id, sequences.title, sequences.steps,"
    " sequence_runs.step_number, sequence_runs.step_started, sequence_runs.created_at"
    " FROM sequence_runs JOIN sequences ON sequences.id = sequence_runs.sequence_id"
    " WHERE sequence_runs.ended_at IS NULL"
)
