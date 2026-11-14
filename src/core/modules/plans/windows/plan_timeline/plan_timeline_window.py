from engine.viewer.window import Window
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.skeleton_part import SkeletonPart


class PlanTimelineWindow(Window):
    """The Timeline window."""

    name = "plans.plan-timeline"
    title = "Timeline"
    entry = "plan-timeline.js"
    loading = WindowLoading.COMPONENT
    place = WindowPlace.SECTION
    icon = WindowIcon.PLAN
    skeleton = [SkeletonPart.line()]
    reads = ["plan timeline"]
    events = ["plan.*"]
