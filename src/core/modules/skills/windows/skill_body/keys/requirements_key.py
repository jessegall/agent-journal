from engine.viewer.window_key import WindowKey


class RequirementsKey(WindowKey):
    """The requirements data of the skills.skill-body window."""

    name = "requirements"
    read = "skill requirements"
    events = ["setting.*"]
