from core.base.chat.dock_declaration import DockDeclaration
from core.base.chat.mark_click import MarkClick
from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from core.modules.plans.models.enums.plan_dock_type import PlanDockType
from core.modules.plans.models.enums.plan_mark_type import PlanMarkType
from core.modules.plans.models.enums.plan_mark_variant import PlanMarkVariant

PLANS_FAMILY = MarkFamily("plans.plans", "Plans", "plan", MarkGroup.WORK)

PLAN_MARKS = [MarkDeclaration(PlanMarkType.PLAN, PlanMarkVariant, PLANS_FAMILY, "Plan moves", "plan", click=MarkClick.OPEN_ROW)]

PLAN_DOCKS = [DockDeclaration(PlanDockType.STARTED, "plan", "{row_title}", "plan-dock.js", most=1, reads=["plan show"])]
