from core.modules.helpers.models.helpers_models import HELPERS_MODELS
from core.modules.helpers.migrations.helpers_migrations import HELPERS_MIGRATIONS
from core.modules.helpers.commands.helpers_handlers import HELPERS_HANDLERS
from core.modules.helpers.commands.helpers_subcommands import HELPERS_SUBCOMMANDS
from core.modules.helpers.guards.helpers_guards import HELPERS_GUARDS
from core.modules.helpers.rules.helpers_driver_rules import HELPERS_DRIVER_RULES
from core.modules.helpers.listeners.helpers_listeners import HELPERS_LISTENERS
from core.modules.helpers.skills.declarations.helpers_skills import HELPERS_SKILLS
from engine.module.module import Module
from core.modules.helpers.support.program_marks import PROGRAM_MARKS
from engine.ticker.tick_handler import TickHandler
from core.modules.helpers.ticks.unstarted_job_starts import UnstartedJobStarts
from engine.ticker.tick_interval import TickInterval
from core.modules.helpers.support.helper_nudges import HELPER_NUDGES
from core.modules.helpers.ticks.helper_limits_tick import HelperLimitsTick
from core.modules.helpers.ticks.usage_limit_marker import UsageLimitMarker
from core.modules.helpers.support.helper_settings import HELPER_SETTINGS
from core.modules.helpers.types.helper import Helper


class HelpersModule(Module):
    """Starts and keeps helpers: extra agents the journal runs on any program, for a parent that hears
    from them by message."""

    name = "journal.core.helpers"
    seed_reason = "demo programs have no outages"
    move_reason = "version 4 had no helpers"
    requires_engine = ">=5,<6"
    migrations = HELPERS_MIGRATIONS
    models = HELPERS_MODELS
    dependencies = ["journal.core.agents", "journal.core.profiles", "journal.core.messages", "journal.core.drivers", "journal.core.usage", "journal.core.chat", "journal.core.skills", "journal.core.settings", "journal.core.processes", "journal.core.environments", "journal.core.tasks", "journal.core.assignments"]
    marks = PROGRAM_MARKS
    helper_types = [Helper]
    settings = HELPER_SETTINGS
    guards = HELPERS_GUARDS
    handlers = HELPERS_HANDLERS
    tick_handlers = [TickHandler(TickInterval(seconds=60), HelperLimitsTick(), "helper limits"), TickHandler(TickInterval(seconds=3), UsageLimitMarker(), "usage limit marks"), TickHandler(TickInterval(seconds=60), UnstartedJobStarts(), "helper jobs that never started")]
    nudges = HELPER_NUDGES
    skills = HELPERS_SKILLS
    subcommands = HELPERS_SUBCOMMANDS
    listeners = HELPERS_LISTENERS
    driver_rules = HELPERS_DRIVER_RULES
