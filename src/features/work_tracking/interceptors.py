from engine.gates import held
from engine.reach import Reach
from features.parts import AgentContext, ToolInterceptor
from engine import command_effects


class RefuseHeldWrites(ToolInterceptor):
    reach = Reach.BOTH

    def intercept(self, context: AgentContext, call) -> str:
        return held(context.record, context.agent.session, context.provider.is_subagent(context.hook)) if command_effects.writes(context.hook) else ""
