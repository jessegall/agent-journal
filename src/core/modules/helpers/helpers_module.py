from core.modules.helpers.declarations.helpers_dependencies import HELPERS_DEPENDENCIES
from core.modules.helpers.declarations.helpers_tick_handlers import HELPERS_TICK_HANDLERS
from core.modules.helpers.effects.hand_in_retry_effect import HandInRetryEffect
from core.modules.helpers.effects.unstarted_helper_effect import UnstartedHelperEffect
from core.modules.helpers.states.job_work_states import JobWorkStates
from core.modules.helpers.effects.job_report_effect import JobReportEffect
from core.modules.helpers.policies.start_names_model_policy import StartNamesModelPolicy
from core.modules.helpers.models.helpers_models import HELPERS_MODELS
from core.modules.helpers.migrations.helpers_migrations import HELPERS_MIGRATIONS
from core.modules.helpers.commands.helpers_handlers import HELPERS_HANDLERS
from core.modules.helpers.commands.helpers_subcommands import HELPERS_SUBCOMMANDS
from core.modules.helpers.guards.helpers_guards import HELPERS_GUARDS
from core.modules.helpers.listeners.helpers_listeners import HELPERS_LISTENERS
from core.modules.helpers.skills.declarations.helpers_skills import HELPERS_SKILLS
from engine.module.module import Module
from core.modules.helpers.marks.program_outage_mark import ProgramOutageMark
from core.modules.helpers.support.helper_agent_messages import HELPER_AGENT_MESSAGES
from core.modules.helpers.support.helper_settings import HELPER_SETTINGS
from core.modules.helpers.types.helper import Helper


class HelpersModule(Module):
    """Starts and keeps helpers: extra agents the journal runs on any program, for a parent that hears
    from them by message."""

    name = "journal.core.helpers"
    policies = [StartNamesModelPolicy]
    states = [JobWorkStates]
    effects = [HandInRetryEffect, UnstartedHelperEffect, JobReportEffect]
    seed_reason = "demo programs have no outages"
    move_reason = "version 4 had no helpers"
    requires_engine = ">=5,<6"
    migrations = HELPERS_MIGRATIONS
    models = HELPERS_MODELS
    dependencies = HELPERS_DEPENDENCIES
    marks = [ProgramOutageMark]
    helper_types = [Helper]
    settings = HELPER_SETTINGS
    guards = HELPERS_GUARDS
    handlers = HELPERS_HANDLERS
    tick_handlers = HELPERS_TICK_HANDLERS
    agent_messages = HELPER_AGENT_MESSAGES
    skills = HELPERS_SKILLS
    subcommands = HELPERS_SUBCOMMANDS
    listeners = HELPERS_LISTENERS
