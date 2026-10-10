import re
import sys
import time
import traceback
from pathlib import Path

from controllers.types import Notices
from engine import runtime
from engine.locks import MigrationsRunning
from engine.record import Record
from resources.base import SYSTEM

CRASH_WITHIN = 8.0
SHOWN = 14
TITLE = "The engine is not running"
FAULT = "The engine hit an error and carried on"
FRAME = re.compile(r'File "([^"]+)", line (\d+)')
DAMAGED = "A row could not be read and is left out"
SAYS = "journal: {where} hit an error and kept going; the last of it is below and the whole of it is in .journal/runtime/engine.log. Fix it, then say so."
STEADY = "the engine has been running cleanly again"
STEADY_AFTER = 30
SAID = "journal: the engine stopped the moment it started, so nothing is being delivered. Its last words are in .journal/runtime/engine.log — fix it, then say so."


def log_file(root: Path) -> Path:
    return runtime.folder(root) / "engine.log"


def logged(root: Path, where: str, text: str) -> None:
    """One entry of the engine's log, headed by the moment it happened, so what a release changed can be seen in it."""
    with log_file(root).open("a") as log:
        log.write(f"{time.strftime('%Y-%m-%d %H:%M:%S')} {where}\n{text}")


def why(root: Path, lines: int = SHOWN) -> str:
    try:
        return "\n".join(log_file(root).read_text(errors="replace").splitlines()[-lines:]).strip()
    except OSError:
        return ""


def crashed(code: int | None, since: float) -> bool:
    return code not in (None, 0) and time.time() - since < CRASH_WITHIN


def notice_stopped(root: Path, env: str, log: str) -> bool:
    return Notices(Record(Path(root), env), actor=SYSTEM).raise_once(TITLE, log or "It left nothing in its log.")


def fault_of(trouble: str) -> str:
    lines = [line for line in trouble.strip().splitlines() if line.strip()]
    return lines[-1].strip() if lines else ""


def place_of(trouble: str) -> str:
    frames = FRAME.findall(trouble)
    kind = fault_of(trouble).split(":", 1)[0]
    return f"{kind} at {frames[-1][0]}:{frames[-1][1]}" if frames else fault_of(trouble)


def broke(record, trouble: str, driver=None, where: str = "the engine") -> None:
    fault = fault_of(trouble)
    if not Notices(record, actor=SYSTEM).raise_once(FAULT, trouble, place_of(trouble)):
        return
    line = SAYS.format(where=where)
    if driver and driver.alive():
        driver.send(f"{line} {fault}")
    else:
        from controllers.types import Nudges
        Nudges(record, actor=SYSTEM).to_primary(f"{where} hit an error"[-80:].replace(":", " "), brief=f"{line} {fault}")


def threw(root: Path, env: str, where: str, driver=None) -> None:
    if isinstance(sys.exc_info()[1], MigrationsRunning):
        return
    trouble = traceback.format_exc()
    try:
        logged(root, where, trouble)
        broke(Record(Path(root), env), trouble, driver, where)
    except Exception:
        traceback.print_exc()


def damaged(record, path: str, error: str) -> None:
    Notices(record, actor=SYSTEM).raise_once(DAMAGED, f"{path} could not be read, so it is left out of every list: {error}", path)


def steady(record) -> None:
    Notices(record, actor=SYSTEM).close_titled(FAULT, STEADY)


def cleared(root: Path, env: str) -> None:
    Notices(Record(Path(root), env), actor=SYSTEM).close_titled(TITLE, "the engine is running again")
