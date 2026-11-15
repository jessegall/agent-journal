from engine.viewer.button_declaration import ButtonDeclaration
from engine.viewer.button_declaration import ButtonCondition


class PlanReviewsEndReviewButton(ButtonDeclaration):
    """The button plan_reviews.end-review."""

    name = "plan_reviews.end-review"
    slots = tuple(["row.plan"])
    label = "End review"
    runs = "plan reviewed {row_id}"
    icon = "tick"
    condition = ButtonCondition("state", tuple(["reviewing"]))
    tip = "The plan is ready again"
