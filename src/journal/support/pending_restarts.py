class PendingRestarts:
    """The agents owed a restart for a changed server set, kept until each one stops its turn: an agent at work is never cut off mid-way."""

    def __init__(self) -> None:
        self._sessions: dict[str, tuple[int, tuple[str, ...]]] = {}

    def add(self, session: str, environment_id: int, resume: tuple[str, ...]) -> None:
        self._sessions[session] = (environment_id, resume)

    def claim(self, session: str) -> tuple[int, tuple[str, ...]] | None:
        return self._sessions.pop(session, None)

    def sessions(self) -> list[str]:
        return list(self._sessions)
