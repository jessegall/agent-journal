from core.base.database.migration import Migration


class ProofTestsMigration(Migration):
    """A proof may name the test command that shows it, and the process that ran it."""

    number = 5
    statements = ["ALTER TABLE proofs ADD COLUMN test_command TEXT NOT NULL DEFAULT ''",
                  "ALTER TABLE proofs ADD COLUMN process_id INTEGER"]
