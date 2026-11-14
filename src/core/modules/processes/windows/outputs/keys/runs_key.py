from engine.viewer.window_key import WindowKey
from core.modules.processes.support.output_window_lines import WINDOW_EVENTS


class RunsKey(WindowKey):
    """The runs data of the processes.outputs window."""

    name = "runs"
    read = "process feed"
    arguments = ["session-agent-id"]
    events = WINDOW_EVENTS
