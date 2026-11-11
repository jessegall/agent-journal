from engine.database.migration import Migration


class DropPhaseTestSettingsMigration(Migration):
    """Removes what the test at the end of a phase left behind: the stored values of the two settings that
    steered it, and its proofs of point 0 that were never checked. A checked one stays as history, and a
    proof whose test is queued or runs is not touched."""

    number = 66
    statements = (
        "DELETE FROM settings WHERE key IN ('journal.suites.coding.workers.test-at-phase-end', 'journal.suites.coding.workers.test-batch-size')",
        "DELETE FROM proofs WHERE point = 0 AND state IN ('shown', 'short', 'committed')",
    )
