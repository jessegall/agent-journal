from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.turn_written import TurnWritten


class TurnGatherer:
    """Claude streams a turn in deltas; every listener wants the whole. The parts are kept here by session and turn until the final one, and each event carries the text so far."""

    def __init__(self) -> None:
        self._parts: dict[str, str] = {}

    def fold(self, event: AgentEvent) -> AgentEvent:
        if not isinstance(event, TurnWritten):
            return event
        key = f"{event.session}:{event.turn_id}"
        whole = self._parts.get(key, "") + event.delta
        if event.final:
            self._parts.pop(key, None)
        else:
            self._parts[key] = whole
        return event.with_text(whole)
