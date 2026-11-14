from engine.viewer.window import Window
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.skeleton_part import SkeletonPart
from core.modules.tasks.windows.task_chain.keys.graph_key import GraphKey


class TaskChainWindow(Window):
    """The What waits on what window."""

    name = "tasks.task-chain"
    title = "What waits on what"
    entry = "task-chain.js"
    loading = WindowLoading.COMPONENT
    place = WindowPlace.SECTION
    icon = WindowIcon.TASK
    skeleton = [SkeletonPart.line()]
    reads = ["task graph"]
    events = ["task.*"]
    keys = [GraphKey]
