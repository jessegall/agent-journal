from engine.database.migration import Migration


class ForeignRunIndexMigration(Migration):
    """Indexes only the hook calls that recorded a run of a project hook: nearly every hook call carries an
    empty list of runs, so the earlier index of calls with the key held most of the table and the read of a
    hook's history walked it all."""

    number = 43
    statements = [
        "DROP INDEX IF EXISTS hook_calls_foreign",
        "CREATE INDEX hook_calls_foreign_runs ON hook_calls (id) WHERE json_array_length(metadata, '$.\"journal.core.drivers\".foreign') > 0",
    ]
