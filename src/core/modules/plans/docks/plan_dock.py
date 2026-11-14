from engine.chat.dock_declaration import DockDeclaration
from core.modules.plans.support.plan_marks import PLAN_DOCK_READS


class PlanDock(DockDeclaration):
    """What every plan dock shows: the plan's title, its phases folded under it, at most six plans at once; each
    state of a plan has a dock of its own."""

    icon = "plan"
    title = "{row_title}"
    body = "plan-dock.js"
    most = 6
    word = "Plan"
    reads = PLAN_DOCK_READS
    folds = "Phases"
