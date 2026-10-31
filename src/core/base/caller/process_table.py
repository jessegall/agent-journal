import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from core.base.timestamp import Timestamp
from core.base.caller.process_row import ProcessRow


PS_TIMEOUT_SECONDS = 5
PS_LINE = ["ps", "-A", "-o", "pid=,ppid=,lstart="]
LSTART_FORMAT = "%a %b %d %H:%M:%S %Y"
PROC_FOLDER = Path("/proc")
START_FIELD_INDEX = 19
def ps_rows(text: str) -> list[ProcessRow]:
    rows: list[ProcessRow] = []
    for line in text.splitlines():
        columns = line.split()
        if len(columns) < 7:
            continue
        started = datetime.strptime(" ".join(columns[2:7]), LSTART_FORMAT).astimezone(timezone.utc)
        rows.append(ProcessRow(int(columns[0]), int(columns[1]), Timestamp(started)))
    return rows
def proc_row(stat_text: str, boot_seconds: float, tick_rate_hertz: int) -> ProcessRow:
    pid_text, stat_tail = stat_text.split(" (", 1)
    fields = stat_tail.rsplit(") ", 1)[1].split()
    started_seconds = int(boot_seconds + int(fields[START_FIELD_INDEX]) / tick_rate_hertz)
    return ProcessRow(int(pid_text), int(fields[1]), Timestamp(datetime.fromtimestamp(started_seconds, timezone.utc)))
class ProcessTable:
    """The machine's running processes, read once: from ps on macOS, from /proc on Linux."""

    def rows(self) -> list[ProcessRow]:
        if sys.platform.startswith("linux"):
            return self.proc_rows()
        finished = subprocess.run(PS_LINE, capture_output=True, text=True, timeout=PS_TIMEOUT_SECONDS, env={"LC_ALL": "C", "PATH": "/bin:/usr/bin"})
        return ps_rows(finished.stdout)

    def proc_rows(self) -> list[ProcessRow]:
        boot_line = next(line for line in (PROC_FOLDER / "stat").read_text().splitlines() if line.startswith("btime "))
        boot_seconds, tick_rate_hertz = float(boot_line.split()[1]), os.sysconf("SC_CLK_TCK")
        rows: list[ProcessRow] = []
        for stat_file in PROC_FOLDER.glob("[0-9]*/stat"):
            try:
                rows.append(proc_row(stat_file.read_text(), boot_seconds, tick_rate_hertz))
            except OSError:
                continue
        return rows
