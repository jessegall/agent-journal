from core.modules.agents.commands.program_command_subcommand import ProgramCommandSubcommand
from core.modules.agents.commands.program_trust_subcommand import ProgramTrustSubcommand
from core.modules.agents.commands.bind_agent_session_handler import BindAgentSessionHandler
from core.modules.agents.commands.agent_terminal_subcommand import AgentTerminalSubcommand
from core.modules.agents.commands.agent_transcript_subcommand import AgentTranscriptSubcommand
from core.modules.agents.commands.end_agent_handler import EndAgentHandler
from core.modules.agents.commands.end_agent_subcommand import EndAgentSubcommand
from core.modules.agents.commands.start_agent_handler import StartAgentHandler
from core.modules.agents.commands.start_agent_subcommand import StartAgentSubcommand
from core.modules.agents.migrations.m001_agents import AgentsTableMigration
from core.modules.agents.models.agent import Agent
from core.modules.agents.upgrade.agents_move import AgentsMove
from core.modules.agents.listeners.subagent_mark_listener import SubagentMarkListener
from core.modules.agents.support.agent_marks import AGENT_MARKS
from core.base.caller.caller_resolver import CallerResolver
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from core.modules.agents.bindings.agent_caller_resolver import AgentCallerResolver
from core.base.module.model_declaration import ModelDeclaration
from core.modules.agents.seeders.agents_seeder import AgentsSeeder


class AgentsModule(Module):
    """Adds agents, one per session of an agent program, each an actor with the same number."""

    name = "journal.core.agents"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.chat"]
    models = [ModelDeclaration(Agent, excluded_subcommands=["make"])]
    moves = [AgentsMove]
    migrations = [AgentsTableMigration]
    handlers = [StartAgentHandler, EndAgentHandler, BindAgentSessionHandler]
    subcommands = [StartAgentSubcommand, EndAgentSubcommand, AgentTranscriptSubcommand, AgentTerminalSubcommand, ProgramCommandSubcommand, ProgramTrustSubcommand]
    bindings = [(CallerResolver, AgentCallerResolver)]
    windows = [WindowDeclaration("agents.agents", "Agents", "agents.js", WindowLoading.COMPONENT, icon=WindowIcon.WORKER, reads=["agent list", "agent show"], events=["agent.*"]),
               WindowDeclaration("agents.subagents", "Subagents", "subagents.js", WindowLoading.COMPONENT, icon=WindowIcon.SUBAGENT, place=WindowPlace.AGENT, reads=["agent list"],
                                 events=["agent.*"]),
               WindowDeclaration("agents.transcript", "Transcript", "transcript.js", WindowLoading.COMPONENT, icon=WindowIcon.DOCUMENT, place=WindowPlace.AGENT,
                                 reads=["agent transcript", "hook-call list"], events=["hook_call.create"])]
    listeners = [SubagentMarkListener]
    marks = AGENT_MARKS
    seeders = [AgentsSeeder]
