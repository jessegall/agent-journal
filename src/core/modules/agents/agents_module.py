from core.modules.agents.commands.program_command.program_command_subcommand import ProgramCommandSubcommand
from core.modules.agents.commands.program_trust.program_trust_subcommand import ProgramTrustSubcommand
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
from core.modules.agents.migrations.m005_agent_identity import AgentIdentityMigration
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.menu_answer import MenuAnswer
from core.modules.agents.upgrade.agents_move import AgentsMove
from core.modules.agents.listeners.menu_answer_mark_listener import MenuAnswerMarkListener
from core.modules.agents.commands.record_menu_answer.record_menu_answer_handler import RecordMenuAnswerHandler
from core.modules.agents.commands.record_menu_answer.record_menu_answer_subcommand import RecordMenuAnswerSubcommand
from core.modules.agents.support.agent_marks import AGENT_MARKS
from core.base.caller.caller_resolver import CallerResolver
from core.base.module.module import Module
from core.base.viewer.auto_scroll import AutoScroll
from core.base.viewer.window_search import WindowSearch
from core.modules.agents.support.agent_searcher import AgentSearcher
from core.base.viewer.choice_option import ChoiceOption
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_shows import WindowShows
from core.base.viewer.window_tab import WindowTab
from core.modules.agents.bindings.agent_caller_resolver import AgentCallerResolver
from core.base.module.model_declaration import ModelDeclaration
from core.modules.agents.seeders.agents_seeder import AgentsSeeder
from core.modules.agents.support.skeletons import AGENTS_AGENTS_SKELETON, AGENTS_SUBAGENTS_SKELETON, AGENTS_TRANSCRIPT_SKELETON


CARD_READS = ["agent list", "agent running", "usage agents", "usage tool", "agent transcript", "hook-call feed", "task show", "file-edit list", "process-part list", "proof list", "worker waits", "worker progress"]
CARD_EVENTS = ["agent.*", "hook_call.*", "task.*", "file_edit.create", "process_part.*", "proof.*", "worker_worktree.*"]
CARD_TABS = [WindowTab("tasks", "Tasks", "usage agents", "tasks"), WindowTab("transcript", "Transcript", "agent transcript"), WindowTab("file-feed", "File feed", "file-edit list")]


class AgentsModule(Module):
    """Adds agents, one per session of an agent program, each an actor with the same number."""

    name = "journal.core.agents"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.chat"]
    models = [ModelDeclaration(Agent, excluded_subcommands=["make"]), ModelDeclaration(MenuAnswer, excluded_subcommands=["make", "edit", "delete"])]
    moves = [AgentsMove]
    migrations = [AgentsTableMigration, AgentLaunchRowMigration, AgentPauseMigration, MenuAnswersMigration, AgentIdentityMigration]
    handlers = [StartAgentHandler, EndAgentHandler, BindAgentSessionHandler, TypeTerminalLineHandler, ChooseAgentControlHandler, StopAgentHandler, LaunchAgentHandler, RecordMenuAnswerHandler]
    subcommands = [ActiveAgentListSubcommand, AgentEnvironmentsSubcommand, AgentMainSubcommand, RecordMenuAnswerSubcommand, StartAgentSubcommand, EndAgentSubcommand, AgentTranscriptSubcommand, AgentTerminalSubcommand, TypeTerminalLineSubcommand, AgentControlsSubcommand, ChooseAgentControlSubcommand, AgentProgramsSubcommand, StopAgentSubcommand, LaunchAgentSubcommand, ProgramCommandSubcommand, ProgramTrustSubcommand]
    bindings = [(CallerResolver, AgentCallerResolver)]
    windows = [WindowDeclaration("agents.agents", "Agents", "agents.js", WindowLoading.COMPONENT, skeleton=AGENTS_AGENTS_SKELETON, search=WindowSearch(AgentSearcher, "Search the agents"), icon=WindowIcon.WORKER, reads=["agent show", *CARD_READS], events=CARD_EVENTS, tabs=CARD_TABS,
                                 options=[ChoiceOption("order", "Order", [("number", "By number"), ("state", "By state"), ("active", "By last active")], "number")]),
               WindowDeclaration("agents.subagents", "Subagents", "subagents.js", WindowLoading.COMPONENT, skeleton=AGENTS_SUBAGENTS_SKELETON, icon=WindowIcon.SUBAGENT, shows=WindowShows.SELECTED_AGENT, reads=CARD_READS,
                                 events=CARD_EVENTS, tabs=CARD_TABS),
               WindowDeclaration("agents.transcript", "Transcript", "transcript.js", WindowLoading.COMPONENT, skeleton=AGENTS_TRANSCRIPT_SKELETON, icon=WindowIcon.DOCUMENT, shows=WindowShows.SELECTED_AGENT, auto_scroll=AutoScroll.BOTTOM,
                                 reads=["agent transcript", "hook-call feed"], events=["hook_call.create"])]
    listeners = [MenuAnswerMarkListener]
    marks = AGENT_MARKS
    seeders = [AgentsSeeder]
