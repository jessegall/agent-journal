from core.modules.schedules.windows.schedules_windows import SCHEDULES_WINDOWS
from core.modules.schedules.models.declarations.scheduled_job_model_declaration import ScheduledJobModelDeclaration
from core.modules.schedules.migrations.m004_schedule_session import ScheduleSessionMigration
from core.modules.schedules.migrations.m005_environment_index import ScheduledJobsEnvironmentIndexMigration
from core.modules.schedules.migrations.m002_stop_requested import StopRequestedMigration
from core.modules.schedules.marks.schedule_run_mark import ScheduleRunMark
from core.modules.schedules.support.schedule_nudges import SCHEDULE_NUDGES
from engine.module.module import Module
from core.modules.schedules.commands.end_scheduled_job.end_scheduled_job_handler import EndScheduledJobHandler
from core.modules.schedules.commands.record_scheduled_job.record_scheduled_job_handler import RecordScheduledJobHandler
from core.modules.schedules.commands.record_scheduled_job_run.record_scheduled_job_run_handler import RecordScheduledJobRunHandler
from core.modules.schedules.commands.scheduled_job_state.scheduled_job_state_subcommand import ScheduledJobStateSubcommand
from core.modules.schedules.commands.stop_scheduled_job.stop_scheduled_job_handler import StopScheduledJobHandler
from core.modules.schedules.commands.stop_scheduled_job.stop_scheduled_job_subcommand import StopScheduledJobSubcommand
from core.modules.schedules.listeners.job_run_mark_listener import JobRunMarkListener
from core.modules.schedules.migrations.m003_job_run_time import JobRunTimeMigration
from core.modules.schedules.migrations.m001_scheduled_jobs import ScheduledJobsTableMigration
from core.modules.schedules.rules.scheduled_job_rule import ScheduledJobRule
from core.modules.schedules.upgrade.schedules_move import SchedulesMove
from core.modules.schedules.rules.scheduled_job_run_rule import ScheduledJobRunRule
from core.modules.schedules.seeders.schedules_seeder import SchedulesSeeder


class SchedulesModule(Module):
    """Adds the record of the jobs an agent schedules in its own program, and a user's way to have one
    stopped."""

    name = "journal.core.schedules"
    nudges = SCHEDULE_NUDGES
    moves = [SchedulesMove]
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.environments", "journal.core.drivers", "journal.core.chat"]
    seeders = [SchedulesSeeder]
    models = [ScheduledJobModelDeclaration]
    migrations = [ScheduleSessionMigration, ScheduledJobsTableMigration, StopRequestedMigration, JobRunTimeMigration, ScheduledJobsEnvironmentIndexMigration]
    handlers = [RecordScheduledJobHandler, RecordScheduledJobRunHandler, EndScheduledJobHandler, StopScheduledJobHandler]
    subcommands = [ScheduledJobStateSubcommand, StopScheduledJobSubcommand]
    driver_rules = [ScheduledJobRule, ScheduledJobRunRule]
    listeners = [JobRunMarkListener]
    marks = [ScheduleRunMark]
    windows = SCHEDULES_WINDOWS
