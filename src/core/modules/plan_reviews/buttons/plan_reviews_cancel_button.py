from engine.viewer.button_declaration import ButtonDeclaration
from engine.viewer.button_declaration import ButtonCondition
from engine.viewer.button_declaration import TextField


class PlanReviewsCancelButton(ButtonDeclaration):
    """The button plan_reviews.cancel."""

    name = "plan_reviews.cancel"
    slots = ("row.plan",)
    label = "Cancel the plan"
    runs = "plan cancel {row_id} --reason={reason}"
    icon = "stop"
    danger = True
    condition = ButtonCondition("state", ("reviewing",))
    fields = (TextField("reason", "Why is it cancelled?"),)
