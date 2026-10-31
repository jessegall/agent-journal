from dataclasses import dataclass, field
from core.base.guard.guard_refusal import GuardRefusal
from core.base.guard.event_listeners import EventListeners


@dataclass
class Explanation:
    """What a command run with --explain found before it was rolled back: every guard's refusal, not only the
    first, and every event it would raise with the listeners that would handle it."""

    refusals: list[GuardRefusal] = field(default_factory=lambda: [])
    events: list[EventListeners] = field(default_factory=lambda: [])

    def lines(self) -> list[str]:
        refusal_lines = [refusal.text for refusal in self.refusals] or ["no guard refuses it"]
        event_lines = [f"{event.event}: handled by {', '.join(event.listeners) or 'no listener'}" for event in self.events]
        return [*refusal_lines, *event_lines, "nothing was changed"]

    def data(self) -> dict[str, object]:
        return {"refusals": [{"guard": refusal.guard, "refused": refusal.reason, "suggestion": refusal.suggestion} for refusal in self.refusals],
                "events": [{"event": event.event, "listeners": list(event.listeners)} for event in self.events]}
