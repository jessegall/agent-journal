import traceback
from pathlib import Path

ENGINE_FOLDER = Path(__file__).resolve().parents[1]
ENGINE_FOLDERS = tuple(str(ENGINE_FOLDER / name) + "/" for name in ("query", "database", "errors"))


class ReadCutError(AssertionError):
    """One read found more rows than it asked for and gave back only its limit: reported, and raised only where
    cuts raise, as under the story kit. It keeps the statement and the limit it was cut at."""

    count: int = 0
    sql: str = ""

    @classmethod
    def cut(cls, limit: int, sql: str) -> "ReadCutError":
        error = cls(f"read cut at {limit} rows: {sql} (from {ReadCutError.calling_line()})")
        error.count, error.sql = limit, sql
        return error

    @staticmethod
    def calling_line() -> str:
        """The file and line outside the query builder that asked for the read."""
        frames = [frame for frame in traceback.extract_stack() if not frame.filename.startswith(ENGINE_FOLDERS)]
        frame = frames[-1] if frames else traceback.extract_stack()[0]
        return f"{frame.filename}:{frame.lineno}"
