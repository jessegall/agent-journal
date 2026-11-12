import re
import sys
from pathlib import Path

from engine.enums.process_kind import ProcessKind
from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor

MEMINFO = Path("/proc/meminfo")
VM_STAT_LIMIT_SECONDS = 5
BYTES_PER_MEGABYTE = 1024 * 1024
KILOBYTES_PER_MEGABYTE = 1024
FREE_PAGE_LINES = ("Pages free", "Pages inactive", "Pages speculative")


class FreeMemory:
    """How many megabytes of memory this machine can give a new run now: the available memory on Linux, and the
    free, inactive and speculative pages on macOS."""

    def __init__(self, executor: ProcessExecutor, home: JournalHome) -> None:
        self.executor, self.home = executor, home

    def megabytes(self) -> int:
        return self.linux_megabytes() if sys.platform.startswith("linux") else self.mac_megabytes()

    @staticmethod
    def linux_megabytes() -> int:
        found = re.search(r"^MemAvailable:\s+(\d+) kB", FileAccess.shared().read(MEMINFO), re.M)
        return int(found.group(1)) // KILOBYTES_PER_MEGABYTE if found else 0

    def mac_megabytes(self) -> int:
        text = self.executor.execute(ExecutionRequest(["vm_stat"], self.home.project_folder, ProcessKind.QUICK, VM_STAT_LIMIT_SECONDS)).stdout
        page = re.search(r"page size of (\d+) bytes", text)
        pages = sum(int(found.group(1)) for line in FREE_PAGE_LINES if (found := re.search(rf"^{line}:\s+(\d+)\.", text, re.M)))
        return pages * int(page.group(1)) // BYTES_PER_MEGABYTE if page else 0
