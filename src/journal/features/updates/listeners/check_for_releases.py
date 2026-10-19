from journal.events.clock_ticked import ClockTicked
from journal.events.listener import Listener
from journal.features.updates.support.updating import Updating


class CheckForReleases(Listener[ClockTicked]):
    """Every tick, asks whether the hour since the last look at the releases has passed."""

    def __init__(self, updating: Updating) -> None:
        self.updating = updating

    def handle(self, event: ClockTicked) -> None:
        self.updating.tick(event.at)
