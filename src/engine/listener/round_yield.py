from contextlib import AbstractContextManager, nullcontext


class RoundYield:
    """Where a round of the server's background work waits its turn for each event it handles. A run outside the
    server has nothing to wait for, so its turn is at once."""

    def event_turn(self, event_name: str) -> AbstractContextManager[None]:
        return nullcontext()
