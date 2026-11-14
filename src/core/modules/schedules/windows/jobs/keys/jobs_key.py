from engine.viewer.window_key import WindowKey


class JobsKey(WindowKey):
    """The jobs data of the schedules.jobs window."""

    name = "jobs"
    read = "scheduled-job running"
    arguments = ["agent"]
    events = ["scheduled_job.*"]
