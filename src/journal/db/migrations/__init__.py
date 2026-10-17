from journal.db.migrations.finish_cancelled_tasks import FinishCancelledTasks
from journal.db.migrations.unwrap_owed_pauses import UnwrapOwedPauses

MIGRATIONS = (UnwrapOwedPauses(), FinishCancelledTasks())
"""Every change to the database after its schema was first created, in order; each runs once, recorded in the migrations table."""
