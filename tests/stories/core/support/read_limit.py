from engine.database.database import Database
from engine.testing.stories.story import Story

READ_LIMIT_ROWS = 50


def limit_reads(story: Story, rows: int = READ_LIMIT_ROWS) -> None:
    story.container.get(Database).read_limit_rows = rows
