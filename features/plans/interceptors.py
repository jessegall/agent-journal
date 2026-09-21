from features.parts import ActionInterceptor, Context, ToolInterceptor
from features.plans.progress import held


class RefusePlanMode(ToolInterceptor):
    def intercept(self, context: Context, call) -> str:
        if not call.plans:
            return ""
        title, brief = context.feature.line("plan mode", {})
        return f"{title} - {brief}"


class HoldWhilePlanned(ActionInterceptor):
    def intercept(self, context: Context, controller, n: int) -> None:
        row = controller.load(n)
        if held(controller.record, row):
            controller._refuse(f"todo {n} is not in the active plan's current phase: finish the plan, raise it to critical, or --force \"<why>\"")
            controller.save(row, "updated", forced=True)
