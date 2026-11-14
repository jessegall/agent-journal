from engine.viewer.window_key import WindowKey


class DashboardsKey(WindowKey):
    """The dashboards data of the plugins.plugins window."""

    name = "dashboards"
    read = "plugin dashboards"
    events = ["plugin.*"]
