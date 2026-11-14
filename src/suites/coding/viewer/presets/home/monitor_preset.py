from engine.viewer.layout_shape import split, tabs
from engine.viewer.viewer_preset import ViewerPreset


class MonitorPreset(ViewerPreset):
    """The terminal beside the file feed and the tasks."""

    key = "monitor"
    name = "Monitor"
    text = "Terminal, feed, tasks"
    shape = split("row", 0.62, tabs("coding.terminal"), split("col", 0.55, tabs("coding.file-feed"), tabs("tasks.tasks")))
