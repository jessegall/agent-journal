from features import trigger
from features.base import Feature, event


class Context(Feature):
    name = "context"
    title_ = "Memory"
    abstract_ = "At each mark of the context window the agent decides — pin, rule or nothing — before any other write"
    help_ = "The marks are the trigger's at list; a pin, a rule, or journal nothing \"<why>\" releases the hold."
    trigger = {"at": [50, 70, 90, 95], "unit": trigger.PERCENT}

    @event("agent.updated")
    def ask(self, event, record) -> None:
        agent = self.agent(event, record)
        if agent.decided:
            return self.release(record)
        if self.due(record, agent):
            pct = agent.context
            self.hold(record, f"context {pct}% full — decide before any other write — journal pin, journal rule, or journal nothing \"<why>\"")
            self.nudge(record, agent, f"context {pct}% full, decide", "pin what a later reader would get wrong without, rule what binds every environment, or nothing \"<why>\"")

    @event("pin.created")
    @event("rule.created")
    def decided(self, event, record) -> None:
        self.release(record)
