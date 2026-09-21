from features.base import held
from features.parts import Context, ToolInterceptor
from features.status_bar import commands
from features.work_tracking.auto import refusal


class RefuseHeldWrites(ToolInterceptor):
    def intercept(self, context: Context, call) -> str:
        return held(context.record, context.agent.session) if context.agent and commands.writes(context.hook) else ""


class RefuseBlockingQuestion(ToolInterceptor):
    behaviour = "auto"

    def intercept(self, context: Context, call) -> str:
        return refusal(context.provider, context.hook)
