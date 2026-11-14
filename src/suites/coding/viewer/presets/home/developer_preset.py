from engine.viewer.layout_shape import split, tabs
from engine.viewer.viewer_preset import ViewerPreset


class DeveloperPreset(ViewerPreset):
    """The chat beside the file feed and tasks, with the terminal under them."""

    key = "developer"
    name = "Developer"
    text = "A layout for developers"
    shape = split("row", 0.62, tabs("messages.chat"), split("col", 0.74, tabs("coding.file-feed", "tasks.tasks"), tabs("coding.terminal")))
