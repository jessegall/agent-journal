from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.features.edits.support.file_times import FileTimes
from journal.support.writes import Writes


class SnapshotFiles(AgentListener[ToolStarting]):
    """Before an interpreter runs a script that writes, the modification time of every project file is kept, so its edits are found from what changed on disk."""

    blocking = True

    def __init__(self, times: FileTimes) -> None:
        self.times = times

    def handle(self, event: ToolStarting) -> None:
        if any(Writes.is_script(part.text) for part in event.call.parts):
            self.times.snapshot(event.tool_use)
