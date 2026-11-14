from engine.viewer.window_key import WindowKey


class ProfilesKey(WindowKey):
    """The profiles data of the skills.skills window."""

    name = "profiles"
    read = "profile list"
    events = ["setting.*"]
