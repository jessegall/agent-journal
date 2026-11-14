from engine.viewer.layout_shape import split, tabs
from engine.viewer.viewer_preset import ViewerPreset


class HomeTerminalPreset(ViewerPreset):
    """A wide terminal beside a narrow chat."""

    key = "terminal"
    name = "Terminal"
    text = "Big terminal, small chat"
    shape = split("row", 0.72, tabs("coding.terminal"), tabs("messages.chat"))
