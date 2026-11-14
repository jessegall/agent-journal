from engine.viewer.window import Window
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.skeleton_part import SkeletonPart
from core.modules.plan_reviews.windows.rounds.keys.rounds_key import RoundsKey


class RoundsWindow(Window):
    """The Review rounds window."""

    name = "plan_reviews.rounds"
    title = "Review rounds"
    entry = "rounds.js"
    loading = WindowLoading.COMPONENT
    place = WindowPlace.SECTION
    slots = tuple(["inspector.plan"])
    icon = WindowIcon.REVIEW
    reads = ["plan rounds"]
    events = ["plan.*"]
    skeleton = tuple([SkeletonPart.line()])
    keys = [RoundsKey]
