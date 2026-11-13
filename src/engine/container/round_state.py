class RoundState:
    """A service that holds state for one round of a server thread only, so a kept container resets it before
    the next round starts."""

    def reset(self) -> None:
        raise NotImplementedError
