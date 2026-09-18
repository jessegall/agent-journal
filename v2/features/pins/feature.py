from v2.controllers.types import CONTROLLERS
from v2.features import trigger
from v2.features.base import Feature, on
from v2.resources.base import SYSTEM


class Pins(Feature):
    name = "pins"
    title_ = "Pins"
    abstract_ = "The environment's pins said again to the agent at every tenth of the context"
    help_ = "A pin is a fact a later reader would get wrong without; it is handed back as the window fills."
    trigger = {"every": 10, "unit": trigger.PERCENT}

    @on("agent.updated")
    def repeat(self, event, record) -> None:
        agent = CONTROLLERS["agent"](record, actor=SYSTEM).load(event.n)
        if not self.due(record, agent):
            return
        pins = [p for p in CONTROLLERS["pin"](record, actor=SYSTEM).all() if not p.completed]
        if pins:
            self.nudge(record, agent, f"{len(pins)} pin{'s' if len(pins) > 1 else ''} standing, read them", "; ".join(f"{p.n}. {p.title}" for p in pins))
