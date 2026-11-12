import traceback

ENGINE_FOLDERS = ("/src/engine/query/", "/src/engine/database/", "/src/engine/errors/")


class ReadCutError(AssertionError):
    """One read found more rows than it asked for and gave back only its limit: reported, never raised."""

    @classmethod
    def cut(cls, limit: int, sql: str) -> "ReadCutError":
        error = cls(f"read cut at {limit} rows: {sql} (from {ReadCutError.calling_line()})")
        error.count, error.sql = limit, sql
        return error

    @staticmethod
    def calling_line() -> str:
        frames = [frame for frame in traceback.extract_stack() if not any(folder in frame.filename for folder in ENGINE_FOLDERS)]
        frame = frames[-1] if frames else traceback.extract_stack()[0]
        return f"{frame.filename}:{frame.lineno}"
