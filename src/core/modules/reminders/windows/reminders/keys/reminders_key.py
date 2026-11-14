from engine.viewer.window_key import WindowKey


class RemindersKey(WindowKey):
    """The reminders data of the reminders.reminders window."""

    name = "reminders"
    read = "reminder list"
    events = ["reminder.*"]
