from engine.viewer.window import Window
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.skeleton_part import SkeletonPart


class TaskDetailsWindow(Window):
    """The Details window."""

    name = "tasks.task-details"
    title = "Details"
    entry = "task-details.js"
    loading = WindowLoading.COMPONENT
    place = WindowPlace.SECTION
    icon = WindowIcon.TASK
    skeleton = [SkeletonPart.line()]
    reads = ["plan place"]
    runs = ["task edit"]
