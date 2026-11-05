from core.base.viewer.model_searcher import ModelSearcher
from core.modules.agents.models.agent import Agent


class AgentSearcher(ModelSearcher):
    """Finds the agents whose name, program, model, profile or session holds the words."""

    model = Agent
