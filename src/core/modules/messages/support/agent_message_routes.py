from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.profiles.support.profile_files import ProfileFiles


class AgentMessageRoutes:
    """Who may message whom: a main agent and its own helpers, in both directions, and an agent that
    takes messages from its siblings (the merger) with the helpers under the same main agent. A
    sender that is not an agent is not limited. An agent of another environment is not found at all, so it is never
    reached."""

    def __init__(self, agents: AgentRows, profiles: ProfileFiles) -> None:
        self.agents, self.profiles = agents, profiles

    def check(self, sender: Actor, receiver: Agent) -> None:
        if sender.type is not ActorType.AGENT:
            return
        agent = self.agents.find(sender.id)
        if agent.id == receiver.id:
            raise Refusal("an agent sends no message to itself", "name another agent in --to")
        if not self.is_related(agent, receiver):
            raise Refusal(f"agent {receiver.id} is not yours to message", "a main agent messages its own helpers, and they message it and the merger")

    def is_related(self, agent: Agent, other: Agent) -> bool:
        if agent.parent_id == other.id or other.parent_id == agent.id:
            return True
        return agent.parent_id is not None and agent.parent_id == other.parent_id and (self.takes_siblings(agent) or self.takes_siblings(other))

    def takes_siblings(self, agent: Agent) -> bool:
        profile = self.profiles.registered(agent.profile)
        return profile is not None and profile.messages_siblings
