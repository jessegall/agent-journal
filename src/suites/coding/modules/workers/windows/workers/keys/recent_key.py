from engine.viewer.window_key import WindowKey


class RecentKey(WindowKey):
    """The recent data of the workers.workers window."""

    name = "recent"
    read = "chat-mark main --type workers.worker"
    tab = "recent"
    events = ["chat_mark.*"]
    arguments = ["limit", "before-id", "after-id"]
    page_size = 50
