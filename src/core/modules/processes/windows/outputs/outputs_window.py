from engine.viewer.window import Window
from core.modules.processes.support.output_window_lines import WINDOW_EVENTS
from core.modules.processes.support.output_window_lines import WINDOW_READS
from core.modules.processes.support.output_window_lines import WINDOW_RUNS
from core.modules.processes.support.process_searcher import ProcessSearcher
from core.modules.processes.support.skeletons import PROCESSES_OUTPUTS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.viewer.window_search import WindowSearch
from core.modules.processes.windows.outputs.keys.runs_key import RunsKey
from core.modules.processes.windows.outputs.keys.marks_key import MarksKey


class OutputsWindow(Window):
    """The Commands window."""

    name = "processes.outputs"
    title = "Commands"
    entry = "outputs.js"
    loading = WindowLoading.COMPONENT
    skeleton = PROCESSES_OUTPUTS_SKELETON
    search = WindowSearch(ProcessSearcher, "Search the commands")
    icon = WindowIcon.TERMINAL
    reads = WINDOW_READS
    runs = WINDOW_RUNS
    events = [*WINDOW_EVENTS, "unreadable_mark.*"]
    keys = [RunsKey, MarksKey]
