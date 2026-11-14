from engine.viewer.window_key import WindowKey


class DashboardKey(WindowKey):
    """The dashboard data of the plugins.plugins window."""

    name = "dashboard"
    read = "plugin dashboard {plugin}"
    tab = "dashboard"
