from events import Fact
from events.agents import AgentChanged
from events.open_viewer import ViewerTabToOpen
from payload import HookEvent
from receiving import Listener
from resources.types import AgentRow, Environment
from serving import ReadRows, ReadViewer


class SpotAgentStart(Listener[AgentChanged]):
    def listen(self, event: AgentChanged, agents: ReadRows[AgentRow], environments: ReadRows[Environment], viewer: ReadViewer) -> list[Fact]:
        row = agents.peek(event.agent)
        if not (event.written or event.action == "reported") or row.event != HookEvent.SESSION_START or row.parent or environments.steered():
            return []
        url = viewer.lately_running()
        return [ViewerTabToOpen(url=url).once(f"viewer opened|{row.title}")] if url else []
