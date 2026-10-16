from journal.db.migrations.unwrap_owed_pauses import UnwrapOwedPauses

MIGRATIONS = (UnwrapOwedPauses(),)
"""Every change to the database after its schema was first created, in order; each runs once, recorded in the migrations table."""
