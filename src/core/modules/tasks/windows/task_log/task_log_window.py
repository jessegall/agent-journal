from engine.viewer.window import Window
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.skeleton_part import SkeletonPart


class TaskLogWindow(Window):
    """The Log window."""

    name = "tasks.task-log"
    title = "Log"
    entry = "task-log.js"
    loading = WindowLoading.COMPONENT
    place = WindowPlace.SECTION
    icon = WindowIcon.TASK
    skeleton = [SkeletonPart.line()]
    reads = ["task-log list"]
    events = ["task_log.*"]
