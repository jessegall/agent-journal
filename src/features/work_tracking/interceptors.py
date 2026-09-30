from engine.gates import held
from engine.reach import Reach
from features.parts import AgentContext, ToolInterceptor
from features.status_bar import commands


class RefuseHeldWrites(ToolInterceptor):
    reach = Reach.BOTH

    def intercept(self, context: AgentContext, call) -> str:
        return held(context.record, context.agent.session, context.provider.is_subagent(context.hook)) if commands.writes(context.hook) else ""
