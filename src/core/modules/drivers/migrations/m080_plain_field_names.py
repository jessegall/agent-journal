from engine.database.migration import Migration


class PlainFieldNamesMigration(Migration):
    """The helper job's report, the permission request's person, the line history's last line, the stack move's
    previous version and the driver and program change counts take the plain column names their fields use;
    the report state's old checks go before, and the sync writes them again."""

    number = 80
    statements = [
        "DROP TRIGGER IF EXISTS helper_jobs_rule_handover_state_insert", "DROP TRIGGER IF EXISTS helper_jobs_rule_handover_state_update",
        "ALTER TABLE helper_jobs RENAME COLUMN handover_state TO report_state",
        "ALTER TABLE helper_jobs RENAME COLUMN handover_source TO report_source",
        "ALTER TABLE helper_jobs RENAME COLUMN handover_failures TO report_failures",
        "ALTER TABLE permission_requests RENAME COLUMN needs_person TO requires_person",
        "ALTER TABLE agent_line_histories RENAME COLUMN last_said_at TO last_given_at",
        "ALTER TABLE agent_stack_moves RENAME COLUMN version_before TO previous_version",
        "ALTER TABLE driver_versions RENAME COLUMN epoch TO change_count",
        "ALTER TABLE program_versions RENAME COLUMN epoch TO change_count",
    ]
