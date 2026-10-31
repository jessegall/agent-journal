from core.modules.agents.agent import Agent
from core.base.module.module import Module
from core.base.module.noun import Noun


class AgentsModule(Module):
    """Adds agents, one per session of an agent program, each an actor with the same number."""

    name = "agents"
    requires_core = ">=5,<6"
    dependencies = ("actors", "environments")
    nouns = (Noun(Agent, excluded_subcommands=("make",)),)
    migrations = ("core.modules.agents.migrations.m001_agents:AgentsTable",)
    handlers = ("core.modules.agents.agent_start_handler:AgentStartHandler",)
    subcommands = ("core.modules.agents.agent_start_subcommand:AgentStartSubcommand",)
