from engine.module.model_declaration import ModelDeclaration
from core.modules.agents.models.agent import Agent
from core.modules.agents.queries.agent_query import AgentQuery


class AgentModelDeclaration(ModelDeclaration):
    """How the module declares Agent."""

    model = Agent
    query = AgentQuery
    excluded_subcommands = ["make"]
