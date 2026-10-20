from journal.events.clock_ticked import ClockTicked
from journal.events.listener import Listener
from journal.features.suggestions.support.suggesting import Suggesting


class SuggestOnTheHour(Listener[ClockTicked]):
    """Every tick, asks whether the next round of suggestions is due."""

    def __init__(self, suggesting: Suggesting) -> None:
        self.suggesting = suggesting

    def handle(self, event: ClockTicked) -> None:
        self.suggesting.tick(event.at)
