from core.modules.agents.agent_end_handler import AgentEndHandler
from core.modules.agents.agent_end_subcommand import AgentEndSubcommand
from core.modules.agents.agent_start_handler import AgentStartHandler
from core.modules.agents.agent_start_subcommand import AgentStartSubcommand
from core.modules.agents.migrations.m001_agents import AgentsTable
from core.modules.agents.agent import Agent
from core.base.caller.caller_resolver import CallerResolver
from core.base.module.module import Module
from core.modules.agents.agent_caller_resolver import AgentCallerResolver
from core.base.module.model_declaration import ModelDeclaration


class AgentsModule(Module):
    """Adds agents, one per session of an agent program, each an actor with the same number."""

    name = "journal.core.agents"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments"]
    models = [ModelDeclaration(Agent, excluded_subcommands=["make"])]
    migrations = [AgentsTable]
    handlers = [AgentStartHandler, AgentEndHandler]
    subcommands = [AgentStartSubcommand, AgentEndSubcommand]
    bindings = [(CallerResolver, AgentCallerResolver)]
