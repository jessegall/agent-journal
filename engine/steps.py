import subprocess
from pathlib import Path

from engine.sessions import SHELLS


def table() -> dict[int, tuple[int, str]]:
    try:
        out = subprocess.run(["ps", "-A", "-o", "pid=,ppid=,command="], capture_output=True, text=True, timeout=2).stdout
    except (OSError, subprocess.TimeoutExpired):
        return {}
    rows = {}
    for line in out.splitlines():
        parts = line.split(None, 2)
        if len(parts) == 3 and parts[0].isdigit() and parts[1].isdigit():
            rows[int(parts[0])] = (int(parts[1]), parts[2])
    return rows


def shell(command: str) -> bool:
    return Path(command.split()[0]).name.lstrip("-") in SHELLS


def running(agent: int, rows: dict[int, tuple[int, str]] | None = None) -> str:
    rows = table() if rows is None else rows
    under = {}
    for pid, (parent, _) in rows.items():
        under.setdefault(parent, []).append(pid)
    for top in sorted((pid for pid in under.get(agent, []) if shell(rows[pid][1])), reverse=True):
        found, stack = [], list(under.get(top, []))
        while stack:
            pid = stack.pop()
            if not shell(rows[pid][1]):
                found.append(pid)
            stack.extend(under.get(pid, []))
        if found:
            return rows[min(found)][1][:400]
    return ""
