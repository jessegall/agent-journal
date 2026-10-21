from journal.events.agent.tool_starting import ToolStarting
from journal.features.triggers.listeners.trigger_watch import TriggerWatch


class WatchTool(TriggerWatch[ToolStarting]):
    def text(self, event: ToolStarting) -> str:
        return event.call.input_text
