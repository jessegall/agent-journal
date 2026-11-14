from engine.viewer.window import Window
from core.modules.plans.support.skeletons import PLANS_PLANS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.viewer.window_tab import WindowTab
from core.modules.plans.windows.plans.keys.open_key import OpenKey
from core.modules.plans.windows.plans.keys.started_key import StartedKey
from core.modules.plans.windows.plans.keys.closed_key import ClosedKey
from core.modules.plans.windows.plans.keys.older_open_key import OlderOpenKey
from core.modules.plans.windows.plans.keys.older_closed_key import OlderClosedKey
from core.modules.plans.windows.plans.keys.plan_key import PlanKey


class PlansWindow(Window):
    """The Plans window."""

    name = "plans.plans"
    title = "Plans"
    entry = "plans.js"
    loading = WindowLoading.COMPONENT
    skeleton = PLANS_PLANS_SKELETON
    icon = WindowIcon.PLAN
    reads = ["plan board", "task list", "plan list", "plan show", "plan progress", "plan outline", "plan inspect", "plan comments", "link list", "phase list", "phase show"]
    events = ["plan.*", "phase.*", "task.*"]
    shared_reads = ["plan show id", "plan progress plan_id", "phase list plan", "phase show id"]
    tabs = [WindowTab("open", "Open", "plan board", "open_total"), WindowTab("started", "Started", "plan board --started", "started_total"), WindowTab("closed", "Closed", "plan board --closed", "closed_total")]
    keys = [OpenKey, StartedKey, ClosedKey, OlderOpenKey, OlderClosedKey, PlanKey]
