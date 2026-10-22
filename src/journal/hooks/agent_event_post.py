from journal.events.agent.agent_event import AgentEvent
from journal.events.bus import Bus


class AgentEventPost:
    """The one way a listener hands the bus an agent event of its own making, a commit seen or a turn read from the transcript, as the receiver hands it a hook's; the answers come back as the receiver's do."""

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def post(self, event: AgentEvent) -> list[object]:
        return self.bus.dispatch(event)
