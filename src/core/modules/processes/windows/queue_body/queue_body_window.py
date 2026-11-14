from engine.viewer.window import Window
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.skeleton_part import SkeletonPart


class QueueBodyWindow(Window):
    """The Process queue window."""

    name = "processes.queue-body"
    title = "Process queue"
    entry = "queue-body.js"
    loading = WindowLoading.COMPONENT
    place = WindowPlace.SECTION
    icon = WindowIcon.TERMINAL
    skeleton = [SkeletonPart.line()]
    reads = ["queue list", "output page", "queue-class list", "queue-class preview"]
    runs = ["setting set", "queue halt", "queue resume", "queue-class set", "queue-class add", "queue-class reset", "queue-class remove", "queue-class preset"]
    events = ["output.*"]
