from engine.database.database import Database


class StoryJournal:
    """How a story's writes are kept: on this plain journal they commit, as the build of a template needs."""

    def defer_writes(self, database: Database) -> None:
        pass

    def discard_writes(self) -> None:
        pass
