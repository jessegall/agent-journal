from pathlib import Path

from core.base.database.row_insert import RowInsert
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_report import MoveReport
from core.modules.processes.support.reader_file import ReaderFile

TABLE = "readers"
READERS_FOLDER = "readers"


class ReaderFilesMove:
    """Carries the readers version 4 kept as files in the readers folder beside its database into version 5's readers, a script one
    still reading through its file; a name version 5 ships already keeps version 5's reader and is counted."""

    def move(self, folder: Path, rows: RowInsert, report: MoveReport, context: MoveContext) -> None:
        for reader_file in ReaderFile.found(folder / READERS_FOLDER):
            if rows.name_row_id(TABLE, reader_file.name) is not None:
                report.drop("reader files version 5 ships a reader of the same name for", 1)
                continue
            reader = reader_file.reader(context.core_actor_id, "")
            rows.insert(TABLE, {"creator_id": reader.creator_id, "name": reader.name, "type": reader.type.value, "commands": reader.commands,
                                "lines_pattern": reader.lines_pattern, "script": reader.script, "progress_pattern": reader.progress_pattern,
                                "finished_pattern": reader.finished_pattern, "failed_pattern": reader.failed_pattern, "summary_pattern": reader.summary_pattern,
                                "topic_pattern": reader.topic_pattern, "title": reader.title, "created_at": context.timestamp, "updated_at": context.timestamp})
            report.count(TABLE, True)
