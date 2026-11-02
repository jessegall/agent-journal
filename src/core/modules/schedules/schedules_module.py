from core.modules.schedules.support.schedule_nudges import SCHEDULE_NUDGES
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from core.modules.schedules.commands.end_scheduled_job.end_scheduled_job_handler import EndScheduledJobHandler
from core.modules.schedules.commands.record_scheduled_job.record_scheduled_job_handler import RecordScheduledJobHandler
from core.modules.schedules.commands.scheduled_job_state.scheduled_job_state_subcommand import ScheduledJobStateSubcommand
from core.modules.schedules.commands.stop_scheduled_job.stop_scheduled_job_handler import StopScheduledJobHandler
from core.modules.schedules.commands.stop_scheduled_job.stop_scheduled_job_subcommand import StopScheduledJobSubcommand
from core.modules.schedules.listeners.ended_agent_jobs_listener import EndedAgentJobsListener
from core.modules.schedules.migrations.m001_scheduled_jobs import ScheduledJobsTableMigration
from core.modules.schedules.models.scheduled_job import ScheduledJob
from core.modules.schedules.rules.scheduled_job_rule import ScheduledJobRule


class SchedulesModule(Module):
    """Adds the record of the jobs an agent schedules in its own program, and a person's way to have one
    stopped."""

    name = "journal.core.schedules"
    nudges = SCHEDULE_NUDGES
    seed_reason = "its jobs are written by an agent's hooks, and the demo has no hooks"
    move_reason = "version 4 kept its jobs in the agent program, not in a table"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.environments", "journal.core.drivers"]
    models = [ModelDeclaration(ScheduledJob, excluded_subcommands=["make", "edit", "delete"])]
    migrations = [ScheduledJobsTableMigration]
    handlers = [RecordScheduledJobHandler, EndScheduledJobHandler, StopScheduledJobHandler]
    subcommands = [ScheduledJobStateSubcommand, StopScheduledJobSubcommand]
    driver_rules = [ScheduledJobRule]
    listeners = [EndedAgentJobsListener]
    windows = [WindowDeclaration("schedules.jobs", "Scheduled jobs", "jobs.js", WindowLoading.COMPONENT, icon=WindowIcon.WINDOW, place=WindowPlace.AGENT,
                                 reads=["scheduled-job running"], runs=["scheduled-job stop"], events=["scheduled_job.*"])]
