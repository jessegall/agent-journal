from features import trigger
from features.base import Feature, on


class Context(Feature):
    name = "context"
    title_ = "The context decision"
    abstract_ = "At each mark of the context window the agent decides — pin, rule or nothing — before any other write"
    help_ = "The marks are the trigger's at list; a pin, a rule, or journal nothing \"<why>\" releases the hold."
    trigger = {"at": [50, 70, 90, 95], "unit": trigger.PERCENT}

    @on("agent.updated")
    def ask(self, event, record) -> None:
        agent = self.agent(event, record)
        if agent.data.get("decided"):
            return self.release(record)
        if self.due(record, agent):
            pct = agent.data.get("context")
            self.hold(record, f"context {pct}% full — decide before any other write — journal pin, journal rule, or journal nothing \"<why>\"")
            self.nudge(record, agent, f"context {pct}% full, decide", "pin what a later reader would get wrong without, rule what binds every environment, or nothing \"<why>\"")

    @on("pin.created")
    @on("rule.created")
    def decided(self, event, record) -> None:
        self.release(record)
