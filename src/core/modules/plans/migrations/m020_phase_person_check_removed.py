from engine.database.migration import Migration


class PhasePersonCheckRemovedMigration(Migration):
    """Drops the phases' person check: a checkpoint whose tests pass opens the phases after it, and nothing waits
    for a person."""

    number = 20
    statements = ["ALTER TABLE phases DROP COLUMN person_check"]
