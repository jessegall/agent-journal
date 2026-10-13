from events import Fact
from events.agents import ClockTicked
from receiving import Listener


class DueOnClock(Listener[ClockTicked]):
    """Turns each tick of the clock into one fact that goes on only when the feature's trigger for the behaviour says it is due."""

    def __init__(self, due: type[Fact], behaviour: str = "") -> None:
        self.fact = due
        self.behaviour = behaviour

    def called(self) -> str:
        return f"{type(self).__name__}{self.fact.__name__}"

    def listen(self, event: ClockTicked) -> list[Fact]:
        return [self.fact(agent=event.agent).due(self.behaviour)]
