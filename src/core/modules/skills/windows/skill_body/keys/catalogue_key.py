from engine.viewer.window_key import WindowKey


class CatalogueKey(WindowKey):
    """The catalogue data of the skills.skill-body window."""

    name = "catalogue"
    read = "skill list"
    events = ["setting.*"]
