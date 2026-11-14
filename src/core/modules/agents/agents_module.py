from core.modules.agents.windows.agents_windows import AGENTS_WINDOWS
from core.modules.agents.models.declarations.agent_model_declaration import AgentModelDeclaration
from core.modules.agents.models.declarations.menu_answer_model_declaration import MenuAnswerModelDeclaration
from core.modules.agents.models.declarations.agent_fold_model_declaration import AgentFoldModelDeclaration
from core.modules.agents.models.declarations.agent_fold_row_model_declaration import AgentFoldRowModelDeclaration
from core.modules.agents.models.declarations.agent_session_model_declaration import AgentSessionModelDeclaration
from core.modules.agents.migrations.m021_menu_answer_agent_index import MenuAnswerAgentIndexMigration
from engine.agent.agent_role_reader import AgentRoleReader
from core.modules.agents.guards.agent_chat_guard import AgentChatGuard
from core.modules.agents.support.agent_role_rows import AgentRoleRows
from core.modules.agents.migrations.m015_kept_agents_index import KeptAgentsIndexMigration
from core.modules.agents.migrations.m016_agent_usage_limit import AgentUsageCapMigration
from core.modules.agents.migrations.m017_agent_interrupt import AgentInterruptMigration
from core.modules.agents.commands.record_agent_interrupt.record_agent_interrupt_handler import RecordAgentInterruptHandler
from core.modules.agents.commands.record_agent_interrupt.record_agent_interrupt_subcommand import RecordAgentInterruptSubcommand
from core.modules.agents.commands.set_agent_usage_limit.set_agent_usage_limit_handler import SetAgentUsageLimitHandler
from core.modules.agents.migrations.m014_agent_retirement import AgentRetirementMigration
from core.modules.agents.migrations.m010_menu_answer_session import MenuAnswerSessionMigration
from core.modules.agents.migrations.m008_agent_parent_index import AgentParentIndexMigration
from core.modules.agents.commands.program_command.program_command_subcommand import ProgramCommandSubcommand
from core.modules.agents.commands.program_trust.program_trust_subcommand import ProgramTrustSubcommand
from core.modules.agents.commands.manage_program.manage_program_subcommand import ManageProgramSubcommand
from core.modules.agents.commands.manage_program.manage_program_handler import ManageProgramHandler
from core.modules.agents.commands.restore_hooks.restore_hooks_handler import RestoreHooksHandler
from core.modules.agents.commands.check_main_agent_fold.check_main_agent_fold_handler import CheckMainAgentFoldHandler
from core.modules.agents.commands.check_main_agent_fold.check_main_agent_fold_subcommand import CheckMainAgentFoldSubcommand
from core.modules.agents.commands.restore_hooks.restore_hooks_subcommand import RestoreHooksSubcommand
from core.modules.agents.commands.bind_agent_session.bind_agent_session_handler import BindAgentSessionHandler
from core.modules.agents.commands.replace_agent_session.replace_agent_session_handler import ReplaceAgentSessionHandler
from core.modules.agents.commands.agent_terminal.agent_terminal_subcommand import AgentTerminalSubcommand
from core.modules.agents.commands.choose_agent_control.choose_agent_control_subcommand import ChooseAgentControlSubcommand
from core.modules.agents.commands.agent_controls.agent_controls_subcommand import AgentControlsSubcommand
from core.modules.agents.commands.agent_environments.agent_environments_subcommand import AgentEnvironmentsSubcommand
from core.modules.agents.commands.agent_main.agent_main_subcommand import AgentMainSubcommand
from core.modules.agents.commands.launch_agent.launch_agent_subcommand import LaunchAgentSubcommand
from core.modules.agents.commands.agent_people.agent_people_subcommand import AgentPeopleSubcommand
from core.modules.agents.commands.agent_programs.agent_programs_subcommand import AgentProgramsSubcommand
from core.modules.agents.guards.agent_name_guard import AgentNameGuard
from core.modules.agents.guards.number_guard import NumberGuard
from core.modules.agents.migrations.m022_agent_number import AgentNumberMigration
from core.modules.agents.guards.retired_delete_guard import RetiredDeleteGuard
from core.modules.agents.guards.retired_row_guard import RetiredRowGuard
from core.modules.agents.commands.retire_agent.retire_agent_handler import RetireAgentHandler
from core.modules.agents.commands.retire_agent.retire_agent_subcommand import RetireAgentSubcommand
from core.modules.agents.commands.stop_agent.stop_agent_subcommand import StopAgentSubcommand
from core.modules.agents.commands.type_terminal_line.type_terminal_line_subcommand import TypeTerminalLineSubcommand
from core.modules.agents.commands.choose_agent_control.choose_agent_control_handler import ChooseAgentControlHandler
from core.modules.agents.commands.launch_agent.launch_agent_handler import LaunchAgentHandler
from core.modules.agents.commands.active_agent_list.active_agent_list_subcommand import ActiveAgentListSubcommand
from core.modules.agents.commands.stop_agent.stop_agent_handler import StopAgentHandler
from core.modules.agents.commands.type_terminal_line.type_terminal_line_handler import TypeTerminalLineHandler
from core.modules.agents.commands.agent_transcript.agent_transcript_subcommand import AgentTranscriptSubcommand
from core.modules.agents.commands.end_agent.end_agent_handler import EndAgentHandler
from core.modules.agents.commands.end_agent.end_agent_subcommand import EndAgentSubcommand
from core.modules.agents.commands.start_agent.start_agent_handler import StartAgentHandler
from core.modules.agents.commands.start_agent.start_agent_subcommand import StartAgentSubcommand
from core.modules.agents.migrations.m001_agents import AgentsTableMigration
from core.modules.agents.migrations.m002_agent_launch_row import AgentLaunchRowMigration
from core.modules.agents.migrations.m003_agent_pause import AgentPauseMigration
from core.modules.agents.migrations.m004_menu_answers import MenuAnswersMigration
from core.modules.agents.migrations.m006_agent_end_name import AgentEndNameMigration
from core.modules.agents.migrations.m005_agent_identity import AgentIdentityMigration
from core.modules.agents.migrations.m007_agent_role_index import AgentRoleIndexMigration
from core.modules.agents.listeners.session_end_listener import SessionEndListener
from core.modules.agents.listeners.session_launch_listener import SessionLaunchListener
from core.modules.agents.migrations.m023_agent_sessions import AgentSessionsMigration
from core.modules.agents.migrations.m027_agent_folds import AgentFoldsMigration
from core.modules.agents.migrations.m028_fold_main_agents import FoldMainAgentsMigration
from core.modules.agents.migrations.m024_main_agent_parent import MainAgentParentMigration
from core.modules.agents.support.local_launcher_transport import LocalLauncherTransport
from core.modules.agents.support.program_transport import ProgramTransport
from core.modules.agents.migrations.m025_agent_launch_failed_at import AgentLaunchFailureColumnMigration
from core.modules.agents.migrations.m026_agent_announced_at import AgentAnnouncedColumnMigration
from core.modules.agents.commands.agent_standing.agent_standing_subcommand import AgentStandingSubcommand
from core.modules.agents.commands.stop_unused_launcher.stop_unused_launcher_handler import StopUnusedLauncherHandler
from core.modules.agents.rules.unused_launcher_rule import UnusedLauncherRule
from core.modules.agents.commands.check_agent_programs.check_agent_programs_handler import CheckAgentProgramsHandler
from core.modules.agents.ticks.agent_reconcile import AgentReconcile
from core.modules.agents.ticks.program_settings_watch import ProgramSettingsWatch
from core.modules.agents.rules.program_settings_rule import ProgramSettingsRule
from core.modules.agents.support.program_settings_nudges import PROGRAM_SETTINGS_BAN
from core.modules.agents.support.agent_program_sessions import AgentProgramSessions
from engine.agent.program_sessions import ProgramSessions
from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from core.modules.agents.commands.start_agent_program.start_agent_program_handler import StartAgentProgramHandler
from core.modules.agents.commands.start_agent_program.start_agent_program_subcommand import StartAgentProgramSubcommand
from core.modules.agents.commands.stop_agent_program.stop_agent_program_handler import StopAgentProgramHandler
from core.modules.agents.commands.stop_agent_program.stop_agent_program_subcommand import StopAgentProgramSubcommand
from core.modules.agents.upgrade.agents_move import AgentsMove
from core.modules.agents.listeners.ended_agent_program_listener import EndedAgentProgramListener
from core.modules.agents.listeners.menu_answer_mark_listener import MenuAnswerMarkListener
from core.modules.agents.commands.show_main_agents.show_main_agents_subcommand import ShowMainAgentsSubcommand
from core.modules.agents.commands.main_sessions.main_sessions_subcommand import MainSessionsSubcommand
from core.modules.agents.commands.agent_sessions.agent_sessions_subcommand import AgentSessionsSubcommand
from core.modules.agents.commands.end_replaced_main.end_replaced_main_handler import EndReplacedMainHandler
from core.modules.agents.commands.record_menu_answer.record_menu_answer_handler import RecordMenuAnswerHandler
from core.modules.agents.commands.record_menu_answer.record_menu_answer_subcommand import RecordMenuAnswerSubcommand
from core.modules.agents.support.agent_marks import AGENT_MARKS
from core.modules.agents.support.agent_inspector import AGENT_INSPECTOR
from engine.caller.caller_resolver import CallerResolver
from engine.module.module import Module
from core.modules.agents.migrations.m009_agent_access import AgentAccessMigration
from core.modules.agents.commands.record_agent_launch_failure.launch_nudges import AGENT_START_FAILED
from core.modules.agents.commands.record_agent_process.record_agent_process_handler import RecordAgentProcessHandler
from engine.agent.agent_checkouts import AgentCheckouts
from core.modules.agents.bindings.agent_caller_resolver import AgentCallerResolver
from core.modules.agents.bindings.agent_row_numbers import AgentRowNumbers
from engine.cli.row_numbers import RowNumbers
from core.modules.agents.bindings.agent_project_checkouts import AgentProjectCheckouts
from core.modules.agents.migrations.m011_helper_rows import HelperRowsMigration
from core.modules.agents.migrations.m012_open_agent_index import OpenAgentIndexMigration
from core.modules.agents.migrations.m013_agent_launch_name import AgentLaunchNameMigration
from core.modules.agents.migrations.m018_plain_column_names import PlainColumnNamesMigration
from core.modules.agents.migrations.m019_agent_launched_at import AgentLaunchColumnMigration
from core.modules.agents.migrations.m020_agent_halted_at import AgentHaltColumnMigration
from core.modules.agents.commands.halt_agent.halt_agent_handler import HaltAgentHandler
from core.modules.agents.commands.end_agent_halt.end_agent_halt_handler import EndAgentHaltHandler
from core.modules.agents.support.report_nudges import REPORT_NUDGES
from core.modules.agents.commands.remove_instruction_import.remove_instruction_import_handler import RemoveInstructionImportHandler
from core.modules.agents.commands.remove_instruction_import.remove_instruction_import_subcommand import RemoveInstructionImportSubcommand
from core.modules.agents.commands.warn_instruction_imports.warn_instruction_imports_handler import WarnInstructionImportsHandler
from core.modules.agents.listeners.boot_instruction_imports_listener import BootInstructionImportsListener
from core.modules.agents.seeders.agents_seeder import AgentsSeeder




class AgentsModule(Module):
    """Adds agents, one per session of an agent program, each an actor with the same number."""

    name = "journal.core.agents"
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.chat"]
    models = [AgentModelDeclaration, MenuAnswerModelDeclaration, AgentFoldModelDeclaration, AgentFoldRowModelDeclaration, AgentSessionModelDeclaration]
    moves = [AgentsMove]
    migrations = [FoldMainAgentsMigration, AgentFoldsMigration, AgentAnnouncedColumnMigration, AgentLaunchFailureColumnMigration, MainAgentParentMigration, AgentSessionsMigration, AgentNumberMigration, MenuAnswerAgentIndexMigration, AgentHaltColumnMigration, AgentLaunchColumnMigration, PlainColumnNamesMigration, AgentInterruptMigration, AgentUsageCapMigration, KeptAgentsIndexMigration, AgentRetirementMigration, AgentLaunchNameMigration, HelperRowsMigration, MenuAnswerSessionMigration, AgentAccessMigration, AgentParentIndexMigration, AgentEndNameMigration, AgentsTableMigration, AgentLaunchRowMigration, AgentPauseMigration, MenuAnswersMigration, AgentIdentityMigration, AgentRoleIndexMigration, OpenAgentIndexMigration]
    nudges = [AGENT_START_FAILED, *REPORT_NUDGES, PROGRAM_SETTINGS_BAN]
    guards = [AgentNameGuard, NumberGuard, RetiredRowGuard, RetiredDeleteGuard, AgentChatGuard]
    tick_handlers = [TickHandler(TickInterval(seconds=30), AgentReconcile(), "agent rows and their programs"),
                     TickHandler(TickInterval(seconds=2), ProgramSettingsWatch(), "program settings watch", starts_immediately=True)]
    driver_rules = [UnusedLauncherRule, ProgramSettingsRule]
    handlers = [StopUnusedLauncherHandler, CheckAgentProgramsHandler, StartAgentProgramHandler, StopAgentProgramHandler, HaltAgentHandler, EndAgentHaltHandler, ReplaceAgentSessionHandler, WarnInstructionImportsHandler, RemoveInstructionImportHandler, RecordAgentInterruptHandler, SetAgentUsageLimitHandler, RetireAgentHandler, EndReplacedMainHandler, RecordAgentProcessHandler, StartAgentHandler, EndAgentHandler, BindAgentSessionHandler, TypeTerminalLineHandler, ChooseAgentControlHandler, StopAgentHandler, LaunchAgentHandler, RecordMenuAnswerHandler, ManageProgramHandler, RestoreHooksHandler, CheckMainAgentFoldHandler]
    subcommands = [RemoveInstructionImportSubcommand, RecordAgentInterruptSubcommand, RetireAgentSubcommand, ShowMainAgentsSubcommand, MainSessionsSubcommand, AgentSessionsSubcommand, AgentStandingSubcommand, StartAgentProgramSubcommand, StopAgentProgramSubcommand, ActiveAgentListSubcommand, AgentEnvironmentsSubcommand, AgentMainSubcommand, RecordMenuAnswerSubcommand, StartAgentSubcommand, EndAgentSubcommand, AgentTranscriptSubcommand, AgentTerminalSubcommand, TypeTerminalLineSubcommand, AgentControlsSubcommand, ChooseAgentControlSubcommand, AgentProgramsSubcommand, AgentPeopleSubcommand, StopAgentSubcommand, LaunchAgentSubcommand, ProgramCommandSubcommand, ProgramTrustSubcommand, ManageProgramSubcommand, RestoreHooksSubcommand, CheckMainAgentFoldSubcommand]
    bindings = {ProgramSessions: AgentProgramSessions, ProgramTransport: LocalLauncherTransport, CallerResolver: AgentCallerResolver, AgentCheckouts: AgentProjectCheckouts, AgentRoleReader: AgentRoleRows, RowNumbers: AgentRowNumbers}
    windows = AGENTS_WINDOWS
    inspectors = [AGENT_INSPECTOR]
    listeners = [SessionEndListener, SessionLaunchListener, MenuAnswerMarkListener, EndedAgentProgramListener, BootInstructionImportsListener]
    marks = AGENT_MARKS
    seeders = [AgentsSeeder]
