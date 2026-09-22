from features.base import held
from features.parts import AgentContext, ToolInterceptor
from features.status_bar import commands


class RefuseHeldWrites(ToolInterceptor):
    def intercept(self, context: AgentContext, call) -> str:
        return held(context.record, context.agent.session) if commands.writes(context.hook) else ""

