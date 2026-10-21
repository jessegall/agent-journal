from journal.events.clock_ticked import ClockTicked
from journal.events.listener import Listener
from journal.features.updates.support.updater import Updater


class ReleaseCheck(Listener[ClockTicked]):
    """Every tick, asks whether the hour since the last look at the releases has passed."""

    def __init__(self, updating: Updater) -> None:
        self.updating = updating

    def handle(self, event: ClockTicked) -> None:
        self.updating.tick(event.time)
