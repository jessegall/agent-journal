class ReadCommands:
    """Commands whose output must reach the agent to count as a read."""

    def names(self) -> tuple[str, ...]:
        return ("overview", "memory list", "task overview", "plan context", "message read", "message unread", "output read")
