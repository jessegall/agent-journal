from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.refusal import Refusal
from core.modules.agents.support.agent_rows import AgentRows


class HelperGrantPolicy:
    """Says who may grant what a helper runs: a person or a main agent."""

    def __init__(self, agents: AgentRows) -> None:
        self.agents = agents

    def check(self, alternatives: tuple[str, ...], context: Context) -> None:
        if context.actor.type is ActorType.AGENT and self.agents.find(context.actor.id).parent_id is not None:
            raise Refusal("only a person or the main agent grants what a helper may run", "ask the main agent")
