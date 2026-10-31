from core.modules.agents.agent_start_handler import AgentStartHandler
from core.modules.agents.agent_start_subcommand import AgentStartSubcommand
from core.modules.agents.migrations.m001_agents import AgentsTable
from core.modules.agents.agent import Agent
from core.base.module.module import Module
from core.base.module.model_declaration import ModelDeclaration


class AgentsModule(Module):
    """Adds agents, one per session of an agent program, each an actor with the same number."""

    name = "agents"
    requires_core = ">=5,<6"
    dependencies = ("actors", "environments")
    models = [ModelDeclaration(Agent, excluded_subcommands=["make"])]
    migrations = [AgentsTable]
    handlers = [AgentStartHandler]
    subcommands = [AgentStartSubcommand]
