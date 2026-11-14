from engine.viewer.window_key import WindowKey


class AttachmentsKey(WindowKey):
    """The attachments data of the messages.attachments window."""

    name = "attachments"
    read = "attachment list"
    arguments = ["category", "skip", "search"]
