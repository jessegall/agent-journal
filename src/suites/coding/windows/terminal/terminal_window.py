from engine.enums.auto_scroll import AutoScroll
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_shows import WindowShows
from engine.viewer.choice_option import ChoiceOption
from engine.viewer.window import Window
from suites.coding.support.skeletons import CODING_TERMINAL_SKELETON
from suites.coding.windows.terminal.keys.calls_key import CallsKey
from suites.coding.windows.terminal.keys.terminal_output_key import TerminalOutputKey


class TerminalWindow(Window):
    """The terminal of the agent shown: its hook calls and the output of its runs."""

    name = "coding.terminal"
    title = "Terminal"
    entry = "terminal.js"
    loading = WindowLoading.COMPONENT
    skeleton = CODING_TERMINAL_SKELETON
    icon = WindowIcon.TERMINAL
    shows = WindowShows.SELECTED_AGENT
    auto_scroll = AutoScroll.BOTTOM
    reads = ["agent terminal", "hook-call feed", "output hook-page"]
    runs = ["agent type"]
    events = ["hook_call.*"]
    options = [ChoiceOption("verbosity", "Detail level", [("commands", "Commands"), ("journal", "Commands and journal"), ("everything", "Show everything")], "everything")]
    keys = [CallsKey, TerminalOutputKey]
