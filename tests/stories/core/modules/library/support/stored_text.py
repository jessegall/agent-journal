from engine.database.database import Database
from engine.database.statement import Statement
from engine.testing.stories.story import Story

FIRST_STORY_ID = 1


def stored_texts(story: Story) -> str:
    database = story.container.get(Database)
    tables = [row["name"] for row in database.rows(Statement("SELECT name FROM sqlite_master WHERE type = 'table'"))]
    return "\n".join(str(tuple(row)) for table in tables for row in database.rows(story_rows_of(database, table)))


def story_rows_of(database: Database, table: str) -> Statement:
    columns = {row["name"] for row in database.rows(Statement(f'PRAGMA table_info("{table}")'))}
    return Statement(f'SELECT * FROM "{table}" WHERE id >= ?', [FIRST_STORY_ID]) if "id" in columns else Statement(f'SELECT * FROM "{table}"')
