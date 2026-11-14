from engine.viewer.window import Window
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.skeleton_part import SkeletonPart


class PlanDetailsWindow(Window):
    """The Details window."""

    name = "plans.plan-details"
    title = "Details"
    entry = "plan-details.js"
    loading = WindowLoading.COMPONENT
    place = WindowPlace.SECTION
    icon = WindowIcon.PLAN
    skeleton = [SkeletonPart.line()]
