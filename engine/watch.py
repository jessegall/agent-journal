import time
from pathlib import Path

CRASH_WITHIN = 8.0
SHOWN = 14
TITLE = "The engine is not running"
FAULT = "The engine hit an error and carried on"
SAYS = "journal: the engine hit an error and kept going; the last of it is below and the whole of it is in .journal/runtime/engine.log. Fix it, then say so."
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


def told(root: Path, env: str, said: str) -> bool:
    from controllers.types import Notices
    from engine.record import Record
    from resources.base import SYSTEM
    notices = Notices(Record(Path(root), env), actor=SYSTEM)
    if any(not n.completed and n.title == TITLE for n in notices.all()):
        return False
    notices.create(TITLE, brief=said or "It left nothing in its log.", tone="warn")
    return True


def fault_of(said: str) -> str:
    lines = [line for line in str(said or "").strip().splitlines() if line.strip()]
    return lines[-1].strip() if lines else ""


def broke(record, said: str, driver=None) -> None:
    from controllers.types import Notices
    from resources.base import SYSTEM
    notices = Notices(record, actor=SYSTEM)
    fault = fault_of(said)
    if any(not n.completed and n.title == FAULT and fault_of(n.brief) == fault for n in notices.all()):
        return
    notices.create(FAULT, brief=said, tone="warn")
    if driver and driver.alive():
        driver.send(f"{SAYS} {fault}")


def steady(record) -> None:
    from controllers.types import Notices
    from resources.base import SYSTEM
    notices = Notices(record, actor=SYSTEM)
    for n in notices.all():
        if not n.completed and n.title == FAULT:
            notices.complete(n.n, STEADY)


def cleared(root: Path, env: str) -> None:
    from controllers.types import Notices
    from engine.record import Record
    from resources.base import SYSTEM
    notices = Notices(Record(Path(root), env), actor=SYSTEM)
    for n in notices.all():
        if not n.completed and n.title == TITLE:
            notices.complete(n.n, "the engine is running again")
