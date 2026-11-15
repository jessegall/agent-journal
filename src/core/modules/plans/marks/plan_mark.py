from engine.chat.mark_declaration import MarkDeclaration
from engine.enums.mark_click import MarkClick
from core.modules.plans.models.enums.plan_mark_type import PlanMarkType
from core.modules.plans.models.enums.plan_mark_variant import PlanMarkVariant
from core.modules.plans.support.plan_marks import PLANS_FAMILY


class PlanMark(MarkDeclaration):
    """The mark PlanMarkType.PLAN."""

    type = PlanMarkType.PLAN
    variants = PlanMarkVariant
    family = PLANS_FAMILY
    label = "Plan moves"
    mark_icon = "plan"
    click = MarkClick.OPEN_ROW
