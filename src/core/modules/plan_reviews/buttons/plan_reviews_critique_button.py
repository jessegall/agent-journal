from engine.viewer.button_declaration import ButtonDeclaration
from engine.viewer.button_declaration import ButtonCondition
from engine.viewer.button_declaration import Choice
from engine.viewer.button_declaration import ChoiceField
from engine.viewer.button_declaration import TemplateField
from core.modules.plans.support.plan_button_slots import WAITING_PLAN_SLOTS


class PlanReviewsCritiqueButton(ButtonDeclaration):
    """The button plan_reviews.critique."""

    name = "plan_reviews.critique"
    slots = WAITING_PLAN_SLOTS
    label = "Request critique"
    runs = "template send {template} --on=plan:{row_id} --set=agents={agents} --set=size={size}"
    icon = "review"
    condition = ButtonCondition("state", tuple(["ready"]))
    tip = "Reviewers read it before you approve"
    fields = (ChoiceField("agents", "How many agents", tuple(Choice("one agent" if count == 1 else f"{count} agents", str(count)) for count in range(1, 6)), "2 agents"),
                                         ChoiceField("size", "How thorough", tuple(Choice(size, size) for size in ("a quick look", "a normal read", "a thorough review")), "a normal read"),
                                         TemplateField("template", "Template", "plan", "critique", "General critique"))
