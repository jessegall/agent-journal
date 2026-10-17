from journal.db.migrations.clear_counts_of_the_old_shape import ClearCountsOfTheOldShape
from journal.db.migrations.finish_cancelled_tasks import FinishCancelledTasks
from journal.db.migrations.give_building_a_plan_its_end import GiveBuildingAPlanItsEnd
from journal.db.migrations.link_worker_reports import LinkWorkerReports
from journal.db.migrations.unwrap_owed_pauses import UnwrapOwedPauses
from journal.db.migrations.unwrap_running_sequences import UnwrapRunningSequences

MIGRATIONS = (UnwrapOwedPauses(), FinishCancelledTasks(), UnwrapRunningSequences(), GiveBuildingAPlanItsEnd(), LinkWorkerReports(), ClearCountsOfTheOldShape())
"""Every change to the database after its schema was first created, in order; each runs once, recorded in the migrations table."""
