from engine.database.write_turns import WriteTurns


class NeverWaitingWriteTurns(WriteTurns):
    """Turns that keep nothing and never wait, for every process but the server: an install, or a command run
    while the server is stopped."""

    def acquire(self) -> None:
        return None

    def release(self) -> None:
        return None
