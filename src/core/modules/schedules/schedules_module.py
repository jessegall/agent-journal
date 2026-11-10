from core.modules.schedules.migrations.m004_schedule_session import ScheduleSessionMigration
from core.modules.schedules.migrations.m002_stop_requested import StopRequestedMigration
from core.modules.schedules.support.schedule_marks import SCHEDULE_MARKS
from core.modules.schedules.support.schedule_nudges import SCHEDULE_NUDGES
from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
from engine.viewer.window_declaration import WindowDeclaration
from engine.viewer.window_key import WindowKey
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.enums.window_shows import WindowShows
from core.modules.schedules.commands.end_scheduled_job.end_scheduled_job_handler import EndScheduledJobHandler
from core.modules.schedules.commands.record_scheduled_job.record_scheduled_job_handler import RecordScheduledJobHandler
from core.modules.schedules.commands.record_scheduled_job_run.record_scheduled_job_run_handler import RecordScheduledJobRunHandler
from core.modules.schedules.commands.scheduled_job_state.scheduled_job_state_subcommand import ScheduledJobStateSubcommand
from core.modules.schedules.commands.stop_scheduled_job.stop_scheduled_job_handler import StopScheduledJobHandler
from core.modules.schedules.commands.stop_scheduled_job.stop_scheduled_job_subcommand import StopScheduledJobSubcommand
from core.modules.schedules.listeners.job_run_mark_listener import JobRunMarkListener
from core.modules.schedules.migrations.m003_job_run_time import JobRunTimeMigration
from core.modules.schedules.migrations.m001_scheduled_jobs import ScheduledJobsTableMigration
from core.modules.schedules.models.scheduled_job import ScheduledJob
from core.modules.schedules.rules.scheduled_job_rule import ScheduledJobRule
from core.modules.schedules.upgrade.schedules_move import SchedulesMove
from core.modules.schedules.rules.scheduled_job_run_rule import ScheduledJobRunRule
from core.modules.schedules.seeders.schedules_seeder import SchedulesSeeder
from core.modules.schedules.support.skeletons import SCHEDULES_JOBS_SKELETON


class SchedulesModule(Module):
    """Adds the record of the jobs an agent schedules in its own program, and a person's way to have one
    stopped."""

    name = "journal.core.schedules"
    nudges = SCHEDULE_NUDGES
    moves = [SchedulesMove]
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.environments", "journal.core.drivers", "journal.core.chat"]
    seeders = [SchedulesSeeder]
    models = [ModelDeclaration(ScheduledJob, excluded_subcommands=["make", "edit", "delete"])]
    migrations = [ScheduleSessionMigration, ScheduledJobsTableMigration, StopRequestedMigration, JobRunTimeMigration]
    handlers = [RecordScheduledJobHandler, RecordScheduledJobRunHandler, EndScheduledJobHandler, StopScheduledJobHandler]
    subcommands = [ScheduledJobStateSubcommand, StopScheduledJobSubcommand]
    driver_rules = [ScheduledJobRule, ScheduledJobRunRule]
    listeners = [JobRunMarkListener]
    marks = SCHEDULE_MARKS
    windows = [WindowDeclaration("schedules.jobs", "Scheduled jobs", "jobs.js", WindowLoading.COMPONENT, skeleton=SCHEDULES_JOBS_SKELETON, icon=WindowIcon.WINDOW, place=WindowPlace.DROPDOWN, shows=WindowShows.SELECTED_AGENT,
                                 reads=["scheduled-job running"], runs=["scheduled-job stop"], events=["scheduled_job.*"],
                                 keys=[WindowKey("jobs", "scheduled-job running", arguments=["agent"], events=["scheduled_job.*"])])]
