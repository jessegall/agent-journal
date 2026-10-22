class Propagation:
    """The walk of one event down a state's listeners: a listener that stops it leaves the ones after it unheard, and the next walk starts it again."""

    def __init__(self) -> None:
        self.ongoing = True

    def stop(self) -> None:
        self.ongoing = False

    def reset(self) -> None:
        self.ongoing = True
