class CompactionLimit:
    """The context size at which the journal compacts an agent, or none when no size is a limit. The module that
    keeps the setting binds its own."""

    def tokens(self) -> int | None:
        return None
