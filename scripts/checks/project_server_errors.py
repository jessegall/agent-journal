"""Fails when another project's journal server logged a problem since the last run: an error, a failed execution, a
hook let through unchecked or a write turn held three seconds or more. The lines read so far are kept as an offset
beside the log, so each problem fails one run only. Usage: project_server_errors.py <project folder>."""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "src"))

from engine.file.file_access import FileAccess  # noqa: E402

LOG = Path(".journal") / "runtime" / "server.log"
OFFSET = Path(".journal") / "runtime" / "error-check-offset"
NOISE = re.compile(r"BrokenPipeError|ConnectionResetError|server-restarting")
TRACE_LINE = re.compile(r"^\S+ error \w+ +(File |~|\^|Traceback| {2})")
PROBLEM = re.compile(r"^\S+ error |execution failed|warning bypass|write turn is held")
HELD = re.compile(r"write turn was held (\d+(?:\.\d+)?) seconds")
SLOW_HOLD_SECONDS = 3.0
SHOWN_LINES = 30


def problems(lines: list[str]) -> list[str]:
    found = []
    for line in lines:
        if NOISE.search(line) or TRACE_LINE.search(line):
            continue
        held = HELD.search(line)
        if PROBLEM.search(line) or (held is not None and float(held.group(1)) >= SLOW_HOLD_SECONDS):
            found.append(line[:240])
    return found


def main(project: Path) -> int:
    log, offset_file = project / LOG, project / OFFSET
    size = FileAccess.stat(log).st_size
    start = int(FileAccess.current(offset_file).strip() or 0) if FileAccess.exists(offset_file) else size
    start = 0 if start > size else start
    text = FileAccess.bytes_range(log, start, size - start).decode(errors="replace")
    FileAccess.write(offset_file, f"{size}\n")
    found = problems(text.splitlines())
    if not found:
        print(f"no problem in {project.name}'s journal server log since the last run")
        return 0
    print(f"{len(found)} problems in {project.name}'s journal server log since the last run:")
    print("\n".join(found[-SHOWN_LINES:]))
    return 1


if __name__ == "__main__":
    raise SystemExit(main(Path(sys.argv[1])))
