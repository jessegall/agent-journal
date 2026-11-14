from engine.viewer.window import Window
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.window_search import WindowSearch
from suites.coding.modules.checks.support.check_searcher import CheckSearcher
from suites.coding.modules.checks.support.skeletons import CHECKS_CHECKS_SKELETON
from suites.coding.modules.checks.windows.checks.keys.checks_key import ChecksKey
from suites.coding.modules.checks.windows.checks.keys.runs_key import RunsKey


class ChecksWindow(Window):
    """The Checks window."""

    name = "checks.checks"
    title = "Checks"
    entry = "checks.js"
    loading = WindowLoading.COMPONENT
    skeleton = CHECKS_CHECKS_SKELETON
    search = WindowSearch(CheckSearcher, "Search the checks")
    place = WindowPlace.PAGE
    group = "project"
    icon = WindowIcon.CHECK
    reads = ["check list", "check runs"]
    count = "check list"
    runs = ["check run", "check start", "check make"]
    events = ["check.*"]
    keys = [ChecksKey, RunsKey]
