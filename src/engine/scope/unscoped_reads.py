import os
import traceback

from engine.file.file_access import FileAccess

LOG_VARIABLE = "JOURNAL_UNSCOPED_READS_LOG"
LOG_FILE = os.environ.get(LOG_VARIABLE, "")
ENGINE_FRAMES = ("/src/engine/query/", "/src/engine/database/", "/src/engine/scope/", "/src/engine/model/")
ORIGIN_FRAMES = 3


class UnscopedReads:
    """A developer inventory, off unless JOURNAL_UNSCOPED_READS_LOG names a file: each read of environment-scoped rows
    with no environment in force and no declared skip adds a line with the model and the calling lines (task 8897)."""

    @staticmethod
    def record(model_name: str) -> None:
        if not LOG_FILE:
            return
        frames = [frame for frame in traceback.extract_stack()[:-2] if "/src/" in frame.filename and not any(part in frame.filename for part in ENGINE_FRAMES)]
        origin = " < ".join(f"{frame.filename.split('/src/', 1)[1]}:{frame.lineno}" for frame in reversed(frames[-ORIGIN_FRAMES:]))
        with FileAccess.writer(LOG_FILE, "a") as log:
            log.write(f"{model_name}\t{origin}\n")
