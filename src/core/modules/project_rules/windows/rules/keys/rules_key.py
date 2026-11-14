from engine.viewer.window_key import WindowKey


class RulesKey(WindowKey):
    """The rules data of the project-rules.rules window."""

    name = "rules"
    read = "rule list"
    events = ["rule.*"]
    arguments = ["limit", "before-id", "after-id"]
    page_size = 50
