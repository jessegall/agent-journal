from engine.viewer.window_key import WindowKey


class DashboardPollKey(WindowKey):
    """The dashboard-poll data of the plugins.plugins window."""

    name = "dashboard-poll"
    read = "plugin dashboard {plugin}"
    tab = "dashboard-poll"
    reload_seconds = 60
