import os
import re
import subprocess
import time
from collections.abc import Callable

from controllers.types import Agents
from engine.record import Record
from engine.sessions import Sessions
from engine.wording import clipped
from providers.command_effects import settled
from resources.base import SYSTEM

WAIT_SECONDS = 60.0
CHECK_EVERY = 2.0
SHOWN = 60
UPGRADE = re.compile(r"\b(?:journal(?:\.py)?|install\.py)\b.*\bupgrade\b")


def parent_of(pid: int) -> int:
    found = subprocess.run(["ps", "-o", "ppid=", "-p", str(pid)], capture_output=True, text=True, timeout=5).stdout.strip()
    return int(found) if found.isdigit() else 0


def ancestors() -> set[int]:
    """The processes this one runs under, up to the first."""
    found, pid = set(), os.getppid()
    while pid > 1 and pid not in found:
        found.add(pid)
        pid = parent_of(pid)
    return found


def running(root) -> list[tuple[Record, object]]:
    """Every live agent whose shell command is still running, in every environment, leaving out the command that runs the upgrade itself."""
    mine, sessions = ancestors(), Sessions(root)
    return [(record, row) for record in Record.every(root) for row in Agents(record, actor=SYSTEM).rows.standing()
            if row.live and row.command_running and not UPGRADE.search(row.running["command"]) and pid_of(sessions, row) not in mine]


def pid_of(sessions: Sessions, row) -> int:
    return sessions.read(row.title).pid


def ended(record: Record, row, waited: float) -> str:
    """Marks a command the update gave up on as ended, with every card that counts it."""
    at = time.time()
    cards = [{**card, "state": "done", "ended": at} if card.get("state") == "running" else card for card in row.data.get("cards") or []]
    Agents(record, actor=SYSTEM).update(row.n, **settled(row, at), cards=cards)
    return f"gave up waiting for `{clipped(row.running['command'], SHOWN)}` in {record.env} after {int(waited)}s and marked it ended"


def wait_for_commands(root, step: Callable[[str], None], wait: float = WAIT_SECONDS, every: float = CHECK_EVERY) -> list[str]:
    """Waits a bounded time for the commands in flight to finish before the build is swapped, and names the ones it gave up on."""
    until = time.time() + wait
    open_runs = running(root)
    while open_runs:
        step(f"Waiting for {len(open_runs)} running command{'s' if len(open_runs) > 1 else ''} to finish")
        if time.time() >= until:
            break
        time.sleep(every)
        open_runs = running(root)
    return [ended(record, row, wait) for record, row in open_runs]
