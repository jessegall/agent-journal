import os
import traceback

from engine.file.file_access import FileAccess

LOG_VARIABLE = "JOURNAL_UNSCOPED_READS_LOG"
LOG_FILE = os.environ.get(LOG_VARIABLE, "")
ENGINE_STACK_FOLDERS = ("/src/engine/query/", "/src/engine/database/", "/src/engine/scope/", "/src/engine/model/")
ORIGIN_STACK_DEPTH = 3


class MissingScopeReads:
    """A developer inventory, off unless JOURNAL_UNSCOPED_READS_LOG names a file: each read of
    environment-scoped rows with no environment in force and no declared skip adds a line with the table
    and the calling lines (task 8897)."""

    @staticmethod
    def record(table_name: str) -> None:
        if not LOG_FILE:
            return
        stack_entries = [stack_entry for stack_entry in traceback.extract_stack()[:-2] if "/src/" in stack_entry.filename and not any(part in stack_entry.filename for part in ENGINE_STACK_FOLDERS)]
        origin = " < ".join(f"{stack_entry.filename.split('/src/', 1)[1]}:{stack_entry.lineno}" for stack_entry in reversed(stack_entries[-ORIGIN_STACK_DEPTH:]))
        with FileAccess.writer(LOG_FILE, "a") as log:
            log.write(f"{table_name}\t{origin}\n")
