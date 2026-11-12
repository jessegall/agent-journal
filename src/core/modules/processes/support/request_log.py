import json
from pathlib import Path

from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from core.modules.processes.support.request_log_entry import RequestLogEntry

LOG_NAME = "request-runs.log"
TAKEN_NAME = "request-runs.taken"


class RequestLog:
    """The file a journal command, viewer request, hook or run of the journal's own appends its ended run to, so
    answering costs no database write. A tick moves the log aside, and the next tick, once a late append to the
    moved file has landed, writes its rows and only then removes it, keeping the rows a busy database refused. A line that is not an entry is left out."""

    def __init__(self, home: JournalHome, files: FileAccess) -> None:
        self.home, self.files = home, files

    @property
    def path(self) -> Path:
        return self.home.folder / LOG_NAME

    @property
    def taken_path(self) -> Path:
        return self.home.folder / TAKEN_NAME

    def append(self, entry: RequestLogEntry) -> None:
        with self.files.writer(self.path, "a") as log:
            log.write(entry.text() + "\n")

    def taken(self) -> tuple[RequestLogEntry, ...]:
        if not self.taken_path.exists():
            return ()
        return tuple(entry for entry in (self.entry(line) for line in self.files.read(self.taken_path).splitlines()) if entry is not None)

    def left(self, entries: tuple[RequestLogEntry, ...]) -> None:
        self.files.write(self.taken_path, "".join(entry.text() + "\n" for entry in entries))

    def written(self, kept: tuple[RequestLogEntry, ...] = ()) -> None:
        self.taken_path.unlink(missing_ok=True)
        if self.path.exists():
            self.files.replace(self.path, self.taken_path)
        if kept:
            with self.files.writer(self.taken_path, "a") as taken:
                taken.write("".join(entry.text() + "\n" for entry in kept))

    @staticmethod
    def entry(line: str) -> RequestLogEntry | None:
        try:
            return RequestLogEntry.parsed(line)
        except (json.JSONDecodeError, KeyError, TypeError, ValueError):
            return None
