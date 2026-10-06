from features.parts import ActionInterceptor, AgentContext, Context, ToolInterceptor
from controllers.types import Todos
from features.plans.controller import Plans
from engine.reach import Reach
from resources.base import SYSTEM


class RefusePlanMode(ToolInterceptor):
    reach = Reach.MAIN
    def intercept(self, context: AgentContext, call) -> str:
        if not call.plans:
            return ""
        title, brief = context.feature.line("plan mode", {})
        return f"{title} - {brief}"


class HoldWhilePlanned(ActionInterceptor):
    def intercept(self, feature_context: Context, controller, todo: int = 0) -> None:
        plans = Plans(controller.record, actor=SYSTEM)
        if todo and plans._holds(Todos(controller.record, actor=controller.actor).load(todo)):
            controller._refuse(f"todo {todo} is not in the active plan's current phase: finish the plan, raise it to critical, or --force \"<why>\"")
        elif not todo and plans._running():
            controller._refuse("a plan is active: open work for a row of its current phase with journal todo start <n>, or --force \"<why>\"")
