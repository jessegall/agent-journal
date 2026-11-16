from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_label import AgentLabel


def agent_label(story, agent_id: int) -> str:
    return AgentLabel.labelled(story.row(Agent, agent_id)).text
