from engine.viewer.window_key import WindowKey


class TriggersKey(WindowKey):
    """The triggers data of the skills.skill-body window."""

    name = "triggers"
    read = "trigger list --skill"
    events = ["trigger.*"]
