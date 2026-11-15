from engine.database.migration import Migration


class ProcessClaimMigration(Migration):
    """A prepared run keeps the token its runner claims it with and when it was claimed, so the same wrapped line run
    twice starts one shell (doc 1310 section 6.7)."""

    number = 85
    statements = tuple(["ALTER TABLE processes ADD COLUMN claim_token TEXT NOT NULL DEFAULT ''", "ALTER TABLE processes ADD COLUMN claimed_at TEXT"])
