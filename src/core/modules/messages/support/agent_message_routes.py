from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.agents.support.agent_label import AgentLabel

MAIN_AGENT_ROUTES = "message your own helpers"
HELPER_ROUTES = "message your main agent and the merger"


class AgentMessageRoutes:
    """Who may message whom: a main agent and its own helpers, in both directions, and an agent that takes
    messages from its siblings (the merger) with the helpers under the same main agent. Every main session of an
    environment counts as the one main agent, so a helper started by a session that ended reaches the main agent
    running now. A sender that is not an agent is not limited. An agent of another environment is not found at
    all, so it is never reached."""

    def __init__(self, agents: AgentRows, profiles: ProfileFiles) -> None:
        self.agents, self.profiles = agents, profiles

    def check(self, sender: Actor, receiver: Agent) -> None:
        if sender.type is not ActorType.AGENT:
            return
        agent = self.agents.find(sender.id)
        if agent.id == receiver.id:
            raise Refusal("an agent sends no message to itself", "name another agent in --to")
        if not self.is_related(agent, receiver):
            raise Refusal(f"{AgentLabel.from_agent(receiver).text} is not yours to message", MAIN_AGENT_ROUTES if agent.role == AgentRole.MAIN else HELPER_ROUTES)

    def is_related(self, agent: Agent, peer: Agent) -> bool:
        if self.parent_key(agent) == self.own_key(peer) or self.parent_key(peer) == self.own_key(agent):
            return True
        return agent.parent_id is not None and self.parent_key(agent) == self.parent_key(peer) and (self.takes_siblings(agent) or self.takes_siblings(peer))

    def own_key(self, agent: Agent) -> int | tuple[str, int]:
        return (AgentRole.MAIN, agent.environment_id) if agent.role == AgentRole.MAIN else agent.id

    def parent_key(self, agent: Agent) -> int | tuple[str, int] | None:
        if agent.parent_id is None:
            return None
        return self.own_key(self.agents.find(agent.parent_id))

    def takes_siblings(self, agent: Agent) -> bool:
        profile = self.profiles.registered(agent.profile)
        return profile is not None and profile.messages_siblings
