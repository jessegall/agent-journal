from engine.viewer.window import Window
from core.modules.messages.support.skeletons import MESSAGES_ATTACHMENTS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.viewer.window_read_search import WindowReadSearch
from core.modules.messages.windows.attachments.keys.attachments_key import AttachmentsKey


class AttachmentsWindow(Window):
    """The Attachments window."""

    name = "messages.attachments"
    title = "Attachments"
    entry = "attachments.js"
    loading = WindowLoading.COMPONENT
    skeleton = MESSAGES_ATTACHMENTS_SKELETON
    group = "project"
    icon = WindowIcon.FILE
    reads = ["attachment list"]
    search = WindowReadSearch("attachment list", "Search file names and their messages", ("name", "message_text"))
    keys = [AttachmentsKey]
