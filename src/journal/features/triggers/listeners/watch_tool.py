from journal.events.agent.tool_starting import ToolStarting
from journal.features.triggers.listeners.watching import Watching


class WatchTool(Watching[ToolStarting]):
    def text_of(self, event: ToolStarting) -> str:
        return event.input_text

    def can_deny(self) -> bool:
        return True
