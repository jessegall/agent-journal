import json

from engine.file.append_log import AppendLog
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
    def lines(self) -> AppendLog:
        return AppendLog(self.home.folder / LOG_NAME, self.home.folder / TAKEN_NAME, self.files)

    def append(self, entry: RequestLogEntry) -> None:
        self.lines.append(entry.text())

    def taken(self) -> tuple[RequestLogEntry, ...]:
        return tuple(entry for entry in (self.entry(line) for line in self.lines.taken_lines()) if entry is not None)

    def replace_taken(self, entries: tuple[RequestLogEntry, ...]) -> None:
        self.lines.replace_taken(tuple(entry.text() for entry in entries))

    def written(self, unwritten: tuple[RequestLogEntry, ...] = ()) -> None:
        self.lines.move_aside(tuple(entry.text() for entry in unwritten))

    @staticmethod
    def entry(line: str) -> RequestLogEntry | None:
        try:
            return RequestLogEntry.parsed(line)
        except (json.JSONDecodeError, KeyError, TypeError, ValueError):
            return None
