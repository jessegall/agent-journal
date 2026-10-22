from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.turn_displayed import TurnDisplayed


class TurnGatherer:
    """Claude streams a turn in parts, and their hooks can land out of order; every listener wants the whole. The parts are kept here by session and turn, by index, and the whole goes out once the final part and every part before it are in."""

    def __init__(self) -> None:
        self._parts: dict[str, dict[int, str]] = {}
        self._last: dict[str, int] = {}

    def fold(self, event: AgentEvent) -> AgentEvent:
        if not isinstance(event, TurnDisplayed):
            return event
        key = f"{event.session}:{event.turn_id}"
        parts = self._parts.setdefault(key, {})
        parts[event.index] = event.delta
        if event.final:
            self._last[key] = event.index
        last = self._last.get(key)
        if last is None or any(i not in parts for i in range(last + 1)):
            return event.with_text("").with_final(False)
        full = "".join(parts[i] for i in range(last + 1))
        self._parts.pop(key, None)
        self._last.pop(key, None)
        return event.with_text(full).with_final(True)
