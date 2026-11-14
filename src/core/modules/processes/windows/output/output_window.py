from engine.viewer.window import Window
from core.modules.processes.support.output_window_lines import WINDOW_EVENTS
from core.modules.processes.support.output_window_lines import WINDOW_READS
from core.modules.processes.support.output_window_lines import WINDOW_RUNS
from core.modules.processes.support.skeletons import PROCESSES_OUTPUT_SKELETON
from engine.enums.auto_scroll import AutoScroll
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from core.modules.processes.windows.output.keys.selection_key import SelectionKey
from core.modules.processes.windows.output.keys.latest_key import LatestKey
from core.modules.processes.windows.output.keys.run_key import RunKey
from core.modules.processes.windows.output.keys.summary_key import SummaryKey
from core.modules.processes.windows.output.keys.output_key import OutputKey


class OutputWindow(Window):
    """The Output window."""

    name = "processes.output"
    title = "Output"
    entry = "output.js"
    loading = WindowLoading.COMPONENT
    skeleton = PROCESSES_OUTPUT_SKELETON
    place = WindowPlace.PAGE
    group = "project"
    icon = WindowIcon.TERMINAL
    auto_scroll = AutoScroll.BOTTOM
    reads = [*WINDOW_READS, "window setting"]
    runs = WINDOW_RUNS
    events = WINDOW_EVENTS
    keys = [SelectionKey, LatestKey, RunKey, SummaryKey, OutputKey]
