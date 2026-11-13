import re
import sys
from pathlib import Path

from engine.enums.process_kind import ProcessKind
from engine.file.file_access import FileAccess
from engine.enums.log_level import LogLevel
from engine.journal.journal_home import JournalHome
from engine.log.system_log_writer import SystemLogWriter
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor

MEMINFO = Path("/proc/meminfo")
VM_STAT_LIMIT_SECONDS = 5
MEGABYTE_BYTES = 1024 * 1024
MEGABYTE_KILOBYTES = 1024
FREE_PAGE_LINES = ("Pages free", "Pages inactive", "Pages speculative")


class FreeMemory:
    """How many megabytes of memory this machine can give a new run now, read each time: the available memory on
    Linux, and the free, inactive and speculative pages on macOS. Where it cannot be read, as on Windows, it
    is not known, and the system log says so once."""

    def __init__(self, executor: ProcessExecutor, home: JournalHome, system_log: SystemLogWriter) -> None:
        self.executor, self.home, self.system_log = executor, home, system_log
        self.is_unknown_noted = False

    def megabytes(self) -> int | None:
        recognized = self.read_megabytes()
        if recognized is None and not self.is_unknown_noted:
            self.is_unknown_noted = True
            self.system_log.write(LogLevel.INFORMATION, "the free memory of this machine cannot be read, so a plugin run that asks for memory goes on without waiting for it")
        return recognized

    def read_megabytes(self) -> int | None:
        try:
            return self.linux_megabytes() if sys.platform.startswith("linux") else self.mac_megabytes()
        except OSError:
            return None

    @staticmethod
    def linux_megabytes() -> int | None:
        matched = re.search(r"^MemAvailable:\s+(\d+) kB", FileAccess.shared().current(MEMINFO), re.M)
        return int(matched.group(1)) // MEGABYTE_KILOBYTES if matched else None

    def mac_megabytes(self) -> int | None:
        text = self.executor.execute(ExecutionRequest(["vm_stat"], self.home.project_folder, ProcessKind.QUICK, VM_STAT_LIMIT_SECONDS)).stdout
        page = re.search(r"page size of (\d+) bytes", text)
        pages = sum(int(matched.group(1)) for line in FREE_PAGE_LINES if (matched := re.search(rf"^{line}:\s+(\d+)\.", text, re.M)))
        return pages * int(page.group(1)) // MEGABYTE_BYTES if page else None
