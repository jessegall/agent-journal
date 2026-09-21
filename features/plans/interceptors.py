from features.parts import Context, ToolInterceptor


class RefusePlanMode(ToolInterceptor):
    def intercept(self, context: Context, call) -> str:
        if not call.plans:
            return ""
        title, brief = context.feature.line("plan mode", {})
        return f"{title} - {brief}"
