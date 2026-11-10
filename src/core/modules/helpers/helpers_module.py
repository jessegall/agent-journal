from core.modules.helpers.migrations.m009_helper_grant_environment_index import HelperGrantEnvironmentIndexMigration
from core.modules.helpers.guards.provider_outage_access_guard import ProviderOutageAccessGuard
from core.modules.helpers.commands.cold_sessions.cold_sessions_subcommand import ColdSessionsSubcommand
from core.modules.helpers.commands.make_provider_outage.make_provider_outage_handler import MakeProviderOutageHandler
from core.modules.helpers.commands.send_program_fault.send_program_fault_handler import SendProgramFaultHandler
from core.modules.helpers.commands.agent_mix.agent_mix_subcommand import AgentMixSubcommand
from core.modules.helpers.migrations.m001_helper_limit_key import HelperCapKeyMigration
from core.modules.helpers.migrations.m002_settle_old_helpers import RetireOldHelpersMigration
from core.modules.helpers.migrations.m003_open_helper_jobs_index import OpenHelperJobsIndexMigration
from engine.module.module import Module
from engine.module.model_declaration import ModelDeclaration
from core.modules.helpers.models.provider_outage import ProviderOutage
from core.modules.helpers.migrations.m004_provider_outages import ProviderOutagesMigration
from core.modules.helpers.migrations.m005_helper_job_counts_index import HelperJobCountsIndexMigration
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
from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from core.modules.helpers.commands.end_helpers_past_limits.end_helpers_past_limits_handler import EndHelpersPastLimitsHandler
from core.modules.helpers.commands.send_helper_limit_warning.send_helper_limit_warning_handler import SendHelperLimitWarningHandler
from core.modules.helpers.support.helper_nudges import HELPER_NUDGES
from core.modules.helpers.ticks.helper_limits_tick import HelperLimitsTick
from core.modules.helpers.ticks.usage_limit_marker import UsageLimitMarker
from core.modules.helpers.migrations.m006_usage_limits import UsageLimitsMigration
from core.modules.helpers.migrations.m007_read_only_helper_setting_keys import HelperSettingKeysMigration
from core.modules.helpers.migrations.m008_helper_grants import HelperGrantsMigration
from core.modules.helpers.models.helper_grant import HelperGrant
from core.modules.helpers.commands.grant_helper.grant_helper_handler import GrantHelperHandler
from core.modules.helpers.commands.grant_helper.grant_helper_subcommand import GrantHelperSubcommand
from core.modules.helpers.commands.run_granted_command.run_granted_command_handler import RunGrantedCommandHandler
from core.modules.helpers.commands.run_granted_command.run_granted_command_subcommand import RunGrantedCommandSubcommand
from core.modules.helpers.models.usage_limit import UsageLimit
from core.modules.helpers.guards.usage_cap_guard import UsageCapGuard
from core.modules.helpers.commands.set_usage_limit.set_usage_limit_handler import SetUsageLimitHandler
from core.modules.helpers.commands.set_usage_limit.set_usage_limit_subcommand import SetUsageLimitSubcommand
from core.modules.helpers.commands.refresh_hourly_limits.refresh_hourly_limits_handler import RefreshHourlyLimitsHandler
from core.modules.helpers.commands.end_agent_lockdown.end_agent_lockdown_handler import EndAgentLockdownHandler
from engine.skill.skill_declaration import SkillDeclaration
from core.modules.helpers.commands.helper_availability.helper_availability_subcommand import HelperAvailabilitySubcommand
from core.modules.helpers.rules.helper_report_rule import HelperReportRule
from core.modules.helpers.rules.helper_skill_read_rule import HelperSkillReadRule
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
    migrations = [HelperGrantEnvironmentIndexMigration, HelperGrantsMigration, OpenHelperJobsIndexMigration, RetireOldHelpersMigration, HelperCapKeyMigration, ProviderOutagesMigration, HelperJobCountsIndexMigration, UsageLimitsMigration, HelperSettingKeysMigration]
    models = [ModelDeclaration(HelperGrant, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(ProviderOutage), ModelDeclaration(UsageLimit, excluded_subcommands=["make"])]
    dependencies = ["journal.core.agents", "journal.core.profiles", "journal.core.messages", "journal.core.drivers", "journal.core.usage", "journal.core.chat", "journal.core.skills", "journal.core.settings", "journal.core.processes", "journal.core.environments", "journal.core.tasks"]
    marks = PROGRAM_MARKS
    settings = HELPER_SETTINGS
    guards = [UsageCapGuard, ProviderOutageAccessGuard, OpenJobRetireGuard, ProviderOutageProgramGuard, ProgramSplitGuard]
    handlers = [EndAgentLockdownHandler, GrantHelperHandler, RunGrantedCommandHandler, SetUsageLimitHandler, RefreshHourlyLimitsHandler, MakeProviderOutageHandler, SendProgramFaultHandler, StartHelperHandler, SendHelperHandler, StopHelperHandler, EndHelperJobHandler, RecordProgramExitHandler, EndHelpersPastLimitsHandler, SendHelperLimitWarningHandler, EndProviderOutagesHandler]
    tick_handlers = [TickHandler(TickInterval(seconds=60), HelperLimitsTick(), "helper limits"), TickHandler(TickInterval(seconds=3), UsageLimitMarker(), "usage limit marks")]
    nudges = HELPER_NUDGES
    skills = [SkillDeclaration("journal-helpers", "Start a helper for a bounded read, send it more, stop it, and read its report; read it before the first helper command of a session", keywords=["helper start"])]
    subcommands = [GrantHelperSubcommand, RunGrantedCommandSubcommand, ColdSessionsSubcommand, SetUsageLimitSubcommand, AgentMixSubcommand, StartHelperSubcommand, SendHelperSubcommand, StopHelperSubcommand, RecordProgramExitSubcommand, HelperAvailabilitySubcommand, MakeProviderOutageSubcommand, EndProviderOutagesSubcommand]
    listeners = [NewMainHelpersListener, HelperResumeListener, HelperProgramListener, HelperEndedListener, HelperJobMarkListener, HelperJobSourceListener, DeletedHelperSourceListener, ProviderOutageMarkListener]
    driver_rules = [UnstartedHelperRule, HelperReportRule, HelperSkillReadRule]
