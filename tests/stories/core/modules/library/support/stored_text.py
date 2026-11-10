from engine.database.database import Database
from engine.database.statement import Statement
from core.testing.story import Story


def stored_texts(story: Story) -> str:
    database = story.container.get(Database)
    tables = [row["name"] for row in database.rows(Statement("SELECT name FROM sqlite_master WHERE type = 'table'"))]
    return "\n".join(str(tuple(row)) for table in tables for row in database.rows(Statement(f'SELECT * FROM "{table}"')))
