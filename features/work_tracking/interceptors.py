from features.base import held
from features.parts import Context, ToolInterceptor
from features.status_bar import commands


class RefuseHeldWrites(ToolInterceptor):
    def intercept(self, context: Context, call) -> str:
        return held(context.record, context.agent.session) if context.agent and commands.writes(context.hook) else ""

