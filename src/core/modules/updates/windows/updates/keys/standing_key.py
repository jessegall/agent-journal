from engine.viewer.window_key import WindowKey


class StandingKey(WindowKey):
    """The standing data of the updates.updates window."""

    name = "standing"
    read = "update check"
    events = ["release.*", "release_install.*"]
