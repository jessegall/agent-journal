import logging

from core.base.file_access import FileAccess
from core.base.journal_home import JournalHome
from core.base.log_level import LogLevel
from core.base.system_log_writer import SystemLogWriter


class NoteLog:
    def __init__(self, home: JournalHome, system_log: SystemLogWriter) -> None:
        self.home, self.system_log, self.log = home, system_log, home.system_log

    def warned_by_logging(self) -> None:
        # @sin architecture_core_log_outside_system_log_writer
        logging.getLogger(__name__).warning("a note failed")

    def appended_by_path(self) -> None:
        # @sin architecture_core_log_outside_system_log_writer
        with self.log.open("a") as log:
            log.write("a note failed")

    def appended_by_funnel(self) -> None:
        # @sin architecture_core_log_outside_system_log_writer
        with FileAccess.shared().writer(self.home.system_log, "a") as log:
            log.write("a note failed")

    def appended_to_a_file(self, path) -> None:
        # @righteous architecture_core_log_outside_system_log_writer
        with FileAccess.shared().writer(path, "a") as note:
            note.write("a note")

    def written_through_the_writer(self) -> None:
        # @righteous architecture_core_log_outside_system_log_writer
        self.system_log.write(LogLevel.WARNING, "a note failed")
