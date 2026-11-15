from engine.viewer.button_declaration import ButtonDeclaration
from engine.viewer.button_declaration import ButtonCondition
from engine.viewer.button_declaration import ButtonMenuItem
from engine.viewer.button_declaration import TextField
from core.modules.plans.support.plan_button_slots import WAITING_PLAN_SLOTS


class PlansApproveButton(ButtonDeclaration):
    """The button plans.approve."""

    name = "plans.approve"
    slots = WAITING_PLAN_SLOTS
    label = "Approve"
    runs = "plan approve {row_id}"
    icon = "check"
    primary = True
    condition = ButtonCondition("state", tuple(["ready"]))
    tip = "Approve the plan; the agent starts it"
    menu_label = "Other ways to approve"
    menu = (tuple([ButtonMenuItem("Approve with a message", "plan approve {row_id} --message={message}",
                                                           tuple([TextField("message", "Message to the agent")]),
                                                           "Your message reaches the agent before the plan starts")]))
