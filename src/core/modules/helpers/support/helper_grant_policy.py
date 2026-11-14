from engine.enums.actor_type import ActorType
from engine.command.context import Context
from engine.errors.refusal import Refusal
from core.modules.agents.support.agent_rows import AgentRows


class HelperGrantPolicy:
    """Says who may grant what a helper runs: a user or a main agent."""

    def __init__(self, agents: AgentRows) -> None:
        self.agents = agents

    def check(self, alternatives: tuple[str, ...], context: Context) -> None:
        if context.actor.type is ActorType.AGENT and self.agents.find(context.actor.id).parent_id is not None:
            raise Refusal("only a user or the main agent grants what a helper may run", "ask the main agent")
