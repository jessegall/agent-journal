import time
import traceback
from pathlib import Path

from controllers.types import Notices
from engine.record import Record
from resources.base import SYSTEM

CRASH_WITHIN = 8.0
SHOWN = 14
TITLE = "The engine is not running"
FAULT = "The engine hit an error and carried on"
WHICH = "fault"
SAYS = "journal: {where} hit an error and kept going; the last of it is below and the whole of it is in .journal/runtime/engine.log. Fix it, then say so."
STEADY = "the engine has been running cleanly again"
STEADY_AFTER = 30
SAID = "journal: the engine stopped the moment it started, so nothing is being delivered. Its last words are in .journal/runtime/engine.log — fix it, then say so."


def log_file(root: Path) -> Path:
    return Path(root) / "runtime" / "engine.log"


def why(root: Path, lines: int = SHOWN) -> str:
    try:
        return "\n".join(log_file(root).read_text(errors="replace").splitlines()[-lines:]).strip()
    except OSError:
        return ""


def crashed(code: int | None, since: float) -> bool:
    return code not in (None, 0) and time.time() - since < CRASH_WITHIN


def once(record, title: str, brief: str, which: str = "") -> bool:
    notices = Notices(record, actor=SYSTEM)
    if any(n.title == title and n.data.get(WHICH, "") == which for n in notices._standing()):
        return False
    notices.create(title, brief=brief, tone="warn", **{WHICH: which})
    return True


def over(record, title: str, how: str) -> None:
    notices = Notices(record, actor=SYSTEM)
    for n in notices._every():
        if not n.completed and n.title == title:
            notices.complete(n.n, how)


def notice_stopped(root: Path, env: str, log: str) -> bool:
    return once(Record(Path(root), env), TITLE, log or "It left nothing in its log.")


def fault_of(trouble: str) -> str:
    lines = [line for line in str(trouble or "").strip().splitlines() if line.strip()]
    return lines[-1].strip() if lines else ""


def broke(record, trouble: str, driver=None, where: str = "the engine") -> None:
    fault = fault_of(trouble)
    if not once(record, FAULT, trouble, fault):
        return
    line = SAYS.format(where=where)
    if driver and driver.alive():
        driver.send(f"{line} {fault}")
    else:
        from controllers.types import Nudges
        Nudges(record, actor=SYSTEM)._to_primary(f"{where} hit an error"[-80:].replace(":", " "), brief=f"{line} {fault}")


def threw(root: Path, env: str, where: str) -> None:
    trouble = traceback.format_exc()
    try:
        with log_file(root).open("a") as log:
            log.write(f"{where}\n{trouble}")
        broke(Record(Path(root), env), trouble, where=where)
    except Exception:
        traceback.print_exc()


def steady(record) -> None:
    over(record, FAULT, STEADY)


def cleared(root: Path, env: str) -> None:
    over(Record(Path(root), env), TITLE, "the engine is running again")
