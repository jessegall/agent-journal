from core.base.database.migration import Migration
from core.base.database.timestamp_sql import TIMESTAMP_SQL
from core.modules.processes.support.stock_reader import STOCK_READERS, StockReader

CORE_ACTOR_ID = 1


def quoted(text: str) -> str:
    return "'" + text.replace("'", "''") + "'"


def insert(reader: StockReader) -> str:
    texts = (reader.name, reader.commands, reader.lines, reader.progress, reader.finished, reader.failed, reader.summary, reader.title)
    return ("INSERT INTO readers (creator_id, name, type, commands, lines_pattern, progress_pattern, finished_pattern, failed_pattern, summary_pattern, title,"
            f" is_default, created_at, updated_at) VALUES ({CORE_ACTOR_ID}, {quoted(texts[0])}, 'pattern', {', '.join(quoted(text) for text in texts[1:])}, 1, {TIMESTAMP_SQL}, {TIMESTAMP_SQL})")


class StockReadersMigration(Migration):
    """Makes the readers the journal ships for pytest, vitest, dotnet test and phpunit or pest, owned by the
    core."""

    number = 3
    statements = tuple(insert(reader) for reader in STOCK_READERS)
