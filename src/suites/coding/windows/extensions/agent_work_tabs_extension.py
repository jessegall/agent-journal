from engine.viewer.window_extension import WindowExtension
from engine.viewer.window_tab import WindowTab
from suites.coding.windows.extensions.keys.agent_edits_key import AgentEditsKey
from suites.coding.windows.extensions.keys.terminal_calls_key import TerminalCallsKey


class AgentWorkTabsExtension(WindowExtension):
    """The file feed and terminal tabs an agent list gets for each agent; the agents and the helpers list each extend
    their window with it."""

    reads = ["file-edit list", "hook-call feed"]
    runs = ["agent type"]
    events = ["file_edit.create"]
    keys = [AgentEditsKey, TerminalCallsKey]
    tabs = [WindowTab("file-feed", "File feed", "file-edit list", component="/modules/journal.suites.coding/agent-file-edits.js"),
            WindowTab("terminal", "Terminal", "hook-call feed", component="/modules/journal.suites.coding/terminal.js")]
