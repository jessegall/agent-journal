from engine.viewer.layout_shape import split, tabs
from engine.viewer.viewer_preset import ViewerPreset


class ReviewPreset(ViewerPreset):
    """The file feed beside the chat."""

    key = "review"
    name = "Review"
    text = "Feed and chat"
    shape = split("row", 0.5, tabs("coding.file-feed"), tabs("messages.chat"))
