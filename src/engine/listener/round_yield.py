from contextlib import AbstractContextManager, nullcontext


class RoundYield:
    """Where a round of the server's background work waits its turn for each event it handles. A run outside the
    server has nothing to wait for, so its turn is at once."""

    def event_turn(self, event_name: str) -> AbstractContextManager[None]:
        return nullcontext()

    # the server's old queue pauses here between events; a round that waits per event never pauses
    def pause(self) -> None:
        return None
