from core.base.database.migration import Migration


class ProofCreatorIndexMigration(Migration):
    """Finds the proofs a worker made by their creator without reading the whole table."""

    number = 59
    statements = ["CREATE INDEX proofs_creator ON proofs (creator_id, id)"]
