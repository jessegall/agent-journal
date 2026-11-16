from core.modules.schedules.declarations.schedules_dependencies import SCHEDULES_DEPENDENCIES
from core.modules.schedules.declarations.schedules_migrations import SCHEDULES_MIGRATIONS
from core.modules.schedules.declarations.schedules_handlers import SCHEDULES_HANDLERS
from core.modules.schedules.effects.scheduled_job_effect import ScheduledJobEffect
from core.modules.schedules.effects.scheduled_job_run_effect import ScheduledJobRunEffect
from core.modules.schedules.windows.schedules_windows import SCHEDULES_WINDOWS
from core.modules.schedules.models.declarations.scheduled_job_model_declaration import ScheduledJobModelDeclaration
from core.modules.schedules.marks.schedule_run_mark import ScheduleRunMark
from core.modules.schedules.support.schedule_agent_messages import SCHEDULE_AGENT_MESSAGES
from engine.module.module import Module
from core.modules.schedules.commands.scheduled_job_state.scheduled_job_state_subcommand import ScheduledJobStateSubcommand
from core.modules.schedules.commands.stop_scheduled_job.stop_scheduled_job_subcommand import StopScheduledJobSubcommand
from core.modules.schedules.listeners.job_run_mark_listener import JobRunMarkListener
from core.modules.schedules.upgrade.schedules_move import SchedulesMove
from core.modules.schedules.seeders.schedules_seeder import SchedulesSeeder


class SchedulesModule(Module):
    """Adds the record of the jobs an agent schedules in its own program, and a user's way to have one
    stopped."""

    name = "journal.core.schedules"
    effects = [ScheduledJobEffect, ScheduledJobRunEffect]
    agent_messages = SCHEDULE_AGENT_MESSAGES
    moves = [SchedulesMove]
    requires_engine = ">=6,<7"
    dependencies = SCHEDULES_DEPENDENCIES
    seeders = [SchedulesSeeder]
    models = [ScheduledJobModelDeclaration]
    migrations = SCHEDULES_MIGRATIONS
    handlers = SCHEDULES_HANDLERS
    subcommands = [ScheduledJobStateSubcommand, StopScheduledJobSubcommand]
    listeners = [JobRunMarkListener]
    marks = [ScheduleRunMark]
    windows = SCHEDULES_WINDOWS
