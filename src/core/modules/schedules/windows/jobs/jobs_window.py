from engine.viewer.window import Window
from core.modules.schedules.support.skeletons import SCHEDULES_JOBS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.enums.window_shows import WindowShows
from core.modules.schedules.windows.jobs.keys.jobs_key import JobsKey


class JobsWindow(Window):
    """The Scheduled jobs window."""

    name = "schedules.jobs"
    title = "Scheduled jobs"
    entry = "jobs.js"
    loading = WindowLoading.COMPONENT
    skeleton = SCHEDULES_JOBS_SKELETON
    icon = WindowIcon.WINDOW
    place = WindowPlace.DROPDOWN
    shows = WindowShows.SELECTED_AGENT
    reads = ["scheduled-job running"]
    runs = ["scheduled-job stop"]
    events = ["scheduled_job.*"]
    keys = [JobsKey]
