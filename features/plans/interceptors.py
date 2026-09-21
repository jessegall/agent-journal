from features.parts import ActionInterceptor, Context, ToolInterceptor
from controllers.types import Todos
from features.plans.progress import held, running


class RefusePlanMode(ToolInterceptor):
    def intercept(self, context: Context, call) -> str:
        if not call.plans:
            return ""
        title, brief = context.feature.line("plan mode", {})
        return f"{title} - {brief}"


class HoldWhilePlanned(ActionInterceptor):
    def intercept(self, context: Context, controller, todo: int = 0) -> None:
        if todo and held(controller.record, Todos(controller.record, actor=controller.actor).load(todo)):
            controller._refuse(f"todo {todo} is not in the active plan's current phase: finish the plan, raise it to critical, or --force \"<why>\"")
        elif not todo and running(controller.record):
            controller._refuse("a plan is active: open work for a row of its current phase with journal todo start <n>, or --force \"<why>\"")
