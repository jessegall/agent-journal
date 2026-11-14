from engine.database.migration import Migration

RUN_SLOT_COST = 4


class LongLaneCapacityMigration(Migration):
    """Carries the runs-at-once setting into the long lane's capacity in slot units: a test run costs 4, so 2 runs
    at once become a capacity of 8 and none is lost. The old setting stays until the old queue is removed."""

    number = 81
    statements = (
        "INSERT INTO settings (environment_id, creator_id, key, value, version, metadata, created_at, updated_at)"
        f" SELECT environment_id, creator_id, 'journal.core.processes.lane-capacity-long', CAST(CAST(value AS INTEGER) * {RUN_SLOT_COST} AS TEXT), 1, '{{}}',"
        " created_at, updated_at FROM settings old WHERE old.key = 'journal.core.processes.run-batch-size' AND NOT EXISTS (SELECT 1 FROM settings new"
        " WHERE new.key = 'journal.core.processes.lane-capacity-long' AND new.environment_id IS old.environment_id)",
    )
