from core.modules.agents.migrations.m010_menu_answer_session import MenuAnswerSessionMigration
from core.modules.agents.migrations.m008_agent_parent_index import AgentParentIndexMigration
from core.modules.agents.commands.program_command.program_command_subcommand import ProgramCommandSubcommand
from core.modules.agents.commands.program_trust.program_trust_subcommand import ProgramTrustSubcommand
from core.modules.agents.commands.manage_program.manage_program_subcommand import ManageProgramSubcommand
from core.modules.agents.commands.manage_program.manage_program_handler import ManageProgramHandler
from core.modules.agents.commands.restore_hooks.restore_hooks_handler import RestoreHooksHandler
from core.modules.agents.commands.restore_hooks.restore_hooks_subcommand import RestoreHooksSubcommand
from core.modules.agents.commands.bind_agent_session.bind_agent_session_handler import BindAgentSessionHandler
from core.modules.agents.commands.agent_terminal.agent_terminal_subcommand import AgentTerminalSubcommand
from core.modules.agents.commands.choose_agent_control.choose_agent_control_subcommand import ChooseAgentControlSubcommand
from core.modules.agents.commands.agent_controls.agent_controls_subcommand import AgentControlsSubcommand
from core.modules.agents.commands.agent_environments.agent_environments_subcommand import AgentEnvironmentsSubcommand
from core.modules.agents.commands.agent_main.agent_main_subcommand import AgentMainSubcommand
from core.modules.agents.commands.launch_agent.launch_agent_subcommand import LaunchAgentSubcommand
from core.modules.agents.commands.agent_programs.agent_programs_subcommand import AgentProgramsSubcommand
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
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.menu_answer import MenuAnswer
from core.modules.agents.upgrade.agents_move import AgentsMove
from core.modules.agents.listeners.menu_answer_mark_listener import MenuAnswerMarkListener
from core.modules.agents.commands.record_menu_answer.record_menu_answer_handler import RecordMenuAnswerHandler
from core.modules.agents.commands.record_menu_answer.record_menu_answer_subcommand import RecordMenuAnswerSubcommand
from core.modules.agents.support.agent_marks import AGENT_MARKS
from core.base.caller.caller_resolver import CallerResolver
from core.base.module.module import Module
from core.modules.agents.migrations.m009_agent_access import AgentAccessMigration
from core.modules.agents.commands.record_agent_launch_failure.record_agent_launch_failure import LAUNCH_FAILURE_NUDGES
from core.modules.agents.commands.record_agent_launch_failure.record_agent_launch_failure_handler import RecordAgentLaunchFailureHandler
from core.base.access import Access
from core.base.agent_type import AgentType
from core.base.viewer.auto_scroll import AutoScroll
from core.base.viewer.window_search import WindowSearch
from core.modules.agents.support.agent_searcher import AgentSearcher
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_shows import WindowShows
from core.base.viewer.window_tab import WindowTab
from core.modules.agents.bindings.agent_caller_resolver import AgentCallerResolver
from core.modules.agents.migrations.m011_helper_rows import HelperRowsMigration
from core.modules.agents.migrations.m012_open_agent_index import OpenAgentIndexMigration
from core.modules.agents.support.report_nudges import REPORT_NUDGES
from core.base.module.model_declaration import ModelDeclaration
from core.modules.agents.seeders.agents_seeder import AgentsSeeder
from core.modules.agents.support.skeletons import AGENTS_AGENTS_SKELETON, AGENTS_HELPERS_SKELETON, AGENTS_TRANSCRIPT_SKELETON


CARD_READS = ["agent cards", "usage agents", "usage tool", "agent transcript", "hook-call feed", "task show", "process-part list"]
CARD_EVENTS = ["agent.*", "hook_call.*", "task.*", "process_part.*"]
CARD_TABS = [WindowTab("tasks", "Tasks", "usage agents", "tasks"), WindowTab("transcript", "Transcript", "agent transcript")]


class AgentsModule(Module):
    """Adds agents, one per session of an agent program, each an actor with the same number."""

    name = "journal.core.agents"
    agent_types = [AgentType("main", "Main agent", access=Access.WRITING), AgentType("helper", "Helper"), AgentType("reviewer", "Reviewer")]
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.chat"]
    models = [ModelDeclaration(Agent, excluded_subcommands=["make"]), ModelDeclaration(MenuAnswer, excluded_subcommands=["make", "edit", "delete"])]
    moves = [AgentsMove]
    migrations = [HelperRowsMigration, MenuAnswerSessionMigration, AgentAccessMigration, AgentParentIndexMigration, AgentEndNameMigration, AgentsTableMigration, AgentLaunchRowMigration, AgentPauseMigration, MenuAnswersMigration, AgentIdentityMigration, AgentRoleIndexMigration, OpenAgentIndexMigration]
    nudges = [*LAUNCH_FAILURE_NUDGES, *REPORT_NUDGES]
    handlers = [RecordAgentLaunchFailureHandler, StartAgentHandler, EndAgentHandler, BindAgentSessionHandler, TypeTerminalLineHandler, ChooseAgentControlHandler, StopAgentHandler, LaunchAgentHandler, RecordMenuAnswerHandler, ManageProgramHandler, RestoreHooksHandler]
    subcommands = [ActiveAgentListSubcommand, AgentEnvironmentsSubcommand, AgentMainSubcommand, RecordMenuAnswerSubcommand, StartAgentSubcommand, EndAgentSubcommand, AgentTranscriptSubcommand, AgentTerminalSubcommand, TypeTerminalLineSubcommand, AgentControlsSubcommand, ChooseAgentControlSubcommand, AgentProgramsSubcommand, StopAgentSubcommand, LaunchAgentSubcommand, ProgramCommandSubcommand, ProgramTrustSubcommand, ManageProgramSubcommand, RestoreHooksSubcommand]
    bindings = {CallerResolver: AgentCallerResolver}
    windows = [WindowDeclaration("agents.agents", "Agents", "agents.js", WindowLoading.COMPONENT, skeleton=AGENTS_AGENTS_SKELETON, search=WindowSearch(AgentSearcher, "Search the agents"), icon=WindowIcon.AGENT, reads=["agent show", *CARD_READS], runs=["message send"], events=CARD_EVENTS, tabs=CARD_TABS),
               WindowDeclaration("agents.helpers", "Helpers", "helpers.js", WindowLoading.COMPONENT, skeleton=AGENTS_HELPERS_SKELETON, icon=WindowIcon.SUBAGENT, shows=WindowShows.SELECTED_AGENT, search=WindowSearch(AgentSearcher, "Search the agents"), reads=CARD_READS, runs=["message send", "helper send", "helper stop"],
                                 events=CARD_EVENTS, tabs=CARD_TABS),
               WindowDeclaration("agents.transcript", "Transcript", "transcript.js", WindowLoading.COMPONENT, skeleton=AGENTS_TRANSCRIPT_SKELETON, icon=WindowIcon.DOCUMENT, shows=WindowShows.SELECTED_AGENT, auto_scroll=AutoScroll.BOTTOM,
                                 reads=["agent transcript", "hook-call feed"], runs=["message send"], events=["hook_call.*"])]
    listeners = [MenuAnswerMarkListener]
    marks = AGENT_MARKS
    seeders = [AgentsSeeder]
