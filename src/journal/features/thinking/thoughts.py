class Thoughts:
    """The latest thought of each agent, kept in memory for the working bubble: each new thought replaces the last, and a visible message clears it."""

    def __init__(self) -> None:
        self._latest: dict[str, str] = {}

    def keep(self, session: str, thought: str) -> None:
        self._latest[session] = thought.strip()

    def clear(self, session: str) -> None:
        self._latest.pop(session, None)

    def latest(self, session: str) -> str:
        return self._latest.get(session, "")
