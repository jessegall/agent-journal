from features.helpers.resource import held_by_helper
from features.parts import ActionInterceptor, Context
from resources.base import AGENT, Ref


def keep_with_its_helper(controller, n: int) -> None:
    row = controller.load(n)
    if controller.actor != AGENT or not held_by_helper(row):
        return
    helper = Ref.parse(row.assigned)
    controller._refuse(f"todo {n} is handed to {helper.spoken}: only it marks it done, and taking its work closes it; "
                       f"to close, strike or reassign it yourself, journal helper stop {helper.n} gives it back first")


class HandedRowsCloseOnlyThroughTheirHelper(ActionInterceptor):
    def intercept(self, feature_context: Context, controller, n: int, **args) -> None:
        keep_with_its_helper(controller, n)


class HandedRowsStayAssigned(ActionInterceptor):
    def intercept(self, feature_context: Context, controller, n: int, **args) -> None:
        if {"assigned", "pending"} & args.keys():
            keep_with_its_helper(controller, n)
