from journal.events.agent.tool_starting import ToolStarting
from journal.features.triggers.listeners.watching import Watching


class WatchTool(Watching[ToolStarting]):
    def text_of(self, event: ToolStarting) -> str:
        return " ".join(str(value) for value in event.input.values())

    def can_deny(self) -> bool:
        return True
