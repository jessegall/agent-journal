from engine.viewer.layout_shape import tabs
from engine.viewer.viewer_preset import ViewerPreset


class HomeChatPreset(ViewerPreset):
    """The chat alone."""

    key = "chat"
    name = "Chat only"
    text = "Only the chat"
    shape = tabs("messages.chat")
