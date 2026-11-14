from engine.viewer.window_extension import WindowExtension
from engine.viewer.window_tab import WindowTab


class AgentProcessesTabsExtension(WindowExtension):
    """The processes tab an agent list gets for each agent; the agents and the helpers list each extend their window
    with it."""

    reads = ["queue list", "output page"]
    events = ["output.*"]
    tabs = [WindowTab("processes", "Processes", "queue list", component="/modules/journal.core.processes/agent-processes.js")]
