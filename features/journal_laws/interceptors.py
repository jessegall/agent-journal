from features.journal_laws.policy import refusal
from features.parts import Context, ToolInterceptor


class EnforceDispatchLaw(ToolInterceptor):
    def intercept(self, context: Context, call) -> str:
        return refusal(context.provider, call)
