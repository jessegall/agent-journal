from core.modules.helpers.commands.send_program_fault.send_program_fault_handler import SendProgramFaultHandler
from core.modules.helpers.commands.agent_mix.agent_mix_subcommand import AgentMixSubcommand
from core.modules.helpers.migrations.m001_helper_limit_key import HelperLimitKeyMigration
from core.modules.helpers.migrations.m002_settle_old_helpers import RetireOldHelpersMigration
from core.modules.helpers.migrations.m003_open_helper_jobs_index import OpenHelperJobsIndexMigration
from core.base.module.module import Module
from core.base.module.model_declaration import ModelDeclaration
from core.modules.helpers.models.provider_outage import ProviderOutage
from core.modules.helpers.migrations.m004_provider_outages import ProviderOutagesMigration
from core.modules.helpers.guards.provider_outage_program_guard import ProviderOutageProgramGuard
from core.modules.helpers.commands.make_provider_outage.make_provider_outage_subcommand import MakeProviderOutageSubcommand
from core.modules.helpers.commands.end_provider_outages.end_provider_outages_handler import EndProviderOutagesHandler
from core.modules.helpers.commands.end_provider_outages.end_provider_outages_subcommand import EndProviderOutagesSubcommand
from core.modules.helpers.listeners.provider_outage_mark_listener import ProviderOutageMarkListener
from core.modules.helpers.support.program_marks import PROGRAM_MARKS
from core.modules.helpers.guards.program_split_guard import ProgramSplitGuard
from core.modules.helpers.guards.open_job_retire_guard import OpenJobRetireGuard
from core.modules.helpers.commands.end_helper_job.end_helper_job_handler import EndHelperJobHandler
from core.modules.helpers.commands.send_helper.send_helper_handler import SendHelperHandler
from core.modules.helpers.commands.send_helper.send_helper_subcommand import SendHelperSubcommand
from core.modules.helpers.commands.start_helper.start_helper_handler import StartHelperHandler
from core.modules.helpers.commands.stop_helper.stop_helper_handler import StopHelperHandler
from core.modules.helpers.commands.stop_helper.stop_helper_subcommand import StopHelperSubcommand
from core.modules.helpers.listeners.helper_ended_listener import HelperEndedListener
from core.modules.helpers.listeners.helper_job_mark_listener import HelperJobMarkListener
from core.modules.helpers.commands.start_helper.start_helper_subcommand import StartHelperSubcommand
from core.modules.helpers.listeners.helper_program_listener import HelperProgramListener
from core.modules.helpers.commands.record_program_exit.record_program_exit_handler import RecordProgramExitHandler
from core.modules.helpers.commands.record_program_exit.record_program_exit_subcommand import RecordProgramExitSubcommand
from core.modules.helpers.listeners.helper_resume_listener import HelperResumeListener
from core.modules.helpers.listeners.new_main_helpers_listener import NewMainHelpersListener
from core.base.ticker.tick_handler import TickHandler
from core.base.ticker.tick_interval import TickInterval
from core.modules.helpers.commands.end_helpers_past_limits.end_helpers_past_limits_handler import EndHelpersPastLimitsHandler
from core.modules.helpers.commands.send_helper_limit_warning.send_helper_limit_warning_handler import SendHelperLimitWarningHandler
from core.modules.helpers.support.helper_nudges import HELPER_NUDGES
from core.modules.helpers.ticks.helper_limits_tick import HelperLimitsTick
from core.base.skill.skill_declaration import SkillDeclaration
from core.modules.helpers.commands.helper_availability.helper_availability_subcommand import HelperAvailabilitySubcommand
from core.modules.helpers.rules.helper_report_rule import HelperReportRule
from core.modules.helpers.rules.unstarted_helper_rule import UnstartedHelperRule
from core.modules.helpers.support.helper_settings import HELPER_SETTINGS
from core.modules.helpers.listeners.helper_job_source_listener import HelperJobSourceListener
from core.modules.helpers.listeners.deleted_helper_source_listener import DeletedHelperSourceListener


class HelpersModule(Module):
    """Starts and keeps helpers: extra agents the journal runs on any program, for a parent that hears
    from them by message."""

    name = "journal.core.helpers"
    seed_reason = "demo programs have no outages"
    move_reason = "version 4 had no helpers"
    requires_core = ">=5,<6"
    migrations = [OpenHelperJobsIndexMigration, RetireOldHelpersMigration, HelperLimitKeyMigration, ProviderOutagesMigration]
    models = [ModelDeclaration(ProviderOutage)]
    dependencies = ["journal.core.agents", "journal.core.profiles", "journal.core.messages", "journal.core.drivers", "journal.core.usage", "journal.core.chat"]
    marks = PROGRAM_MARKS
    settings = HELPER_SETTINGS
    guards = [OpenJobRetireGuard, ProviderOutageProgramGuard, ProgramSplitGuard]
    handlers = [SendProgramFaultHandler, StartHelperHandler, SendHelperHandler, StopHelperHandler, EndHelperJobHandler, RecordProgramExitHandler, EndHelpersPastLimitsHandler, SendHelperLimitWarningHandler, EndProviderOutagesHandler]
    tick_handlers = [TickHandler(TickInterval(seconds=60), HelperLimitsTick(), "helper limits")]
    nudges = HELPER_NUDGES
    skills = [SkillDeclaration("journal-helpers", "Start a helper for a bounded read, send it more, stop it, and read its report; read it before the first helper command of a session", keywords=["helper start"])]
    subcommands = [AgentMixSubcommand, StartHelperSubcommand, SendHelperSubcommand, StopHelperSubcommand, RecordProgramExitSubcommand, HelperAvailabilitySubcommand, MakeProviderOutageSubcommand, EndProviderOutagesSubcommand]
    listeners = [NewMainHelpersListener, HelperResumeListener, HelperProgramListener, HelperEndedListener, HelperJobMarkListener, HelperJobSourceListener, DeletedHelperSourceListener, ProviderOutageMarkListener]
    driver_rules = [UnstartedHelperRule, HelperReportRule]
