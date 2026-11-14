from engine.viewer.window_key import WindowKey


class HooksKey(WindowKey):
    """The hooks data of the settings.project-hooks window."""

    name = "hooks"
    read = "managed-hook list"
    events = ["managed-hook.*"]
