from engine.viewer.window_key import WindowKey


class TemplatesKey(WindowKey):
    """The templates data of the templates.templates window."""

    name = "templates"
    read = "template list"
    events = ["template.*"]
