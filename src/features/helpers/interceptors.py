from features.parts import ActionInterceptor, Context
from resources.base import AGENT, Ref


class OnlyItsHelperClosesARow(ActionInterceptor):
    def intercept(self, feature_context: Context, controller, n: int, how: str = "", **data) -> None:
        held = controller.load(n).assigned
        if controller.actor != AGENT or not held.startswith("helper:"):
            return None
        helper = Ref.parse(held)
        controller._refuse(f"todo {n} is handed to {helper.spoken}: only it marks it done, and taking its work closes it; "
                           f"journal helper stop {helper.n} gives it back")
